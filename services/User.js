const fs = require("fs");
const db = require("../db/db");
const User = db.User;
const {
  userHandler,
  getRandomNumber,
  userHandlerWithoutToken
} = require("../handlers/Data");
const {
  userErrors,
  registerErrors,
  updatePasswordErrors
} = require("../handlers/ErrorHandler");

module.exports = {
  login,
  getUser,
  getUsers,
  getRandomUser,
  search,
  register,
  updatePhoto,
  updatePassword,
  remove
};

async function login({ username, password }) {
  return new Promise(async (resolve, reject) => {
    const user = await User.findOne({ username });

    console.log(user);

    if (user && user.validPassword(password)) {
      const token = user.generateJWT();
      const data = userHandler(user, token);

      resolve(data);
    } else if (user) {
      reject({ password: "Password is incorrect." });
    }

    reject({ username: "Username is incorrect." });
  });
}

async function getUser(req) {
  return new Promise(async (resolve, reject) => {
    const user = await User.findById(req.userData.id);

    if (user) {
      resolve(userHandler(user));
      return;
    }

    reject("User not found.");
  });
}

async function getUsers({ userData: { id } }) {
  return User.find({ _id: { $ne: id } }, (err, res) => {
    if (err) {
      return err;
    }

    const users = res.map(user => userHandlerWithoutToken(user));

    return users;
  });
}

async function getRandomUser({ userData: { id } }) {
  let users = await User.find(
    {
      _id: { $ne: id },
      status: true
    },
    { salt: 0, hash: 0 }
  );

  const user = users[getRandomNumber(users.length - 1)];
  return Promise.resolve(user);
}

async function register(req) {
  const { body } = req;

  if (body.password.length < 6) {
    return Promise.reject("Password must not be less than 6 characters");
  }
  try {
    const user = new User(body);
    //{ expiresIn: 0 }
    user.setPassword(body.password);
    const token = user.generateJWT();
    await user.save();
    const data = userHandler(user, token);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error.message);
  }
}

async function updatePhoto(req) {
  const {
    userData: { id },
    file: { path },
    protocol
  } = req;
  const url = `${protocol}://${req.get("host")}/${path}`;

  try {
    const user = await User.findById(id);
    if (user.profile_photo) {
      fs.unlinkSync(
        user.profile_photo.replace(`${protocol}://${req.get("host")}/`, "")
      );
    }

    user.profile_photo = url;
    await user.save();
    return Promise.resolve({ message: "Photo was successfully saved." });
  } catch ({ message }) {
    return Promise.reject(message);
  }
}

async function updatePassword(req) {
  const {
    body: { password, new_password },
    userData: { id }
  } = req;

  User.findById(id)
    .then(async user => {
      const error = updatePasswordErrors({ user, password, new_password });
      if (error) {
        return Promise.reject(error);
      }

      const hash = user.setPassword(new_password);
      Object.assign(user, hash);
      await user.save();
      return Promise.resolve({ message: "Password was updated." });
    })
    .catch(({ message }) => Promise.reject(message));
}

async function remove(req) {
  User.findByIdAndDelete(req.userData.id)
    .then(() => Promise.resolve("User was deleted."))
    .catch(({ message }) => Promise.reject(message));
}

async function search({ body: { username }, userData: { id } }) {
  return User.find(
    {
      username: { $regex: username, $options: "i" },
      _id: { $ne: id }
    },
    { salt: 0, hash: 0 }
  );
}
