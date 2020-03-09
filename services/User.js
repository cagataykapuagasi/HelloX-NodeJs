const config = require("../config.json");
const jwt = require("jsonwebtoken");
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
  update,
  updatePhoto,
  updatePassword,
  remove
};

async function login({ username, password }) {
  return new Promise(async (resolve, reject) => {
    const user = await User.findOne({ username });

    console.log(user);

    if (user && user.validPassword(password)) {
      const token = jwt.sign({ sub: user.id }, config.secret);
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
    const user = await User.findById(req.userData.sub);

    if (user) {
      resolve(userHandler(user));
      return;
    }

    reject("User not found.");
  });
}

async function getUsers({ userData: { sub } }) {
  return User.find({ _id: { $ne: sub } }, (err, res) => {
    if (err) {
      return err;
    }

    const users = res.map(user => userHandlerWithoutToken(user));

    return users;
  });
}

async function getRandomUser({ userData: { sub } }) {
  let users = await User.find(
    {
      _id: { $ne: sub },
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
    const token = jwt.sign({ sub: user.id }, config.secret);
    await user.save();
    const data = userHandler(user, token);
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error.message);
  }
}

async function update(req) {
  const {
    body,
    userData: { sub }
  } = req;

  return new Promise(async (resolve, reject) => {
    User.findById(sub)
      .then(async user => {
        if (
          user.username === body.username &&
          (await User.findOne({ username: body.username }))
        ) {
          reject(`Username '${body.username}' is already taken.`);
          return;
        }

        const error = userErrors(body);

        if (error) {
          reject(error);
          return;
        }

        const newUser = body;
        Object.assign(user, newUser);
        const data = userHandler(user);
        resolve(data);

        await user.save();
      })
      .catch(({ message }) => reject(message));
  });
}

async function updatePhoto(req) {
  const {
    userData: { sub },
    file: { path },
    protocol
  } = req;
  const url = `${protocol}://${req.get("host")}/${path}`;

  try {
    const user = await User.findById(sub);
    fs.unlinkSync(
      user.profile_photo.replace(`${protocol}://${req.get("host")}/`, "")
    );
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
    userData: { sub }
  } = req;

  console.log(password, new_password);

  return new Promise((resolve, reject) => {
    User.findById(sub)
      .then(async user => {
        const error = updatePasswordErrors({ user, password, new_password });
        if (error) {
          return reject(error);
        }

        const hash = user.setPassword(new_password);
        Object.assign(user, hash);
        resolve({ message: "Password was updated." });
        await user.save();
      })
      .catch(({ message }) => reject(message));
  });
}

async function remove(req) {
  return new Promise((resolve, reject) =>
    User.findByIdAndDelete(req.userData.sub)
      .then(res => {
        resolve("User was deleted.");
      })
      .catch(({ message }) => reject(message))
  );
}

async function search({ body: { username }, userData: { sub } }) {
  return User.find(
    {
      username: { $regex: username, $options: "i" },
      _id: { $ne: sub }
    },
    { salt: 0, hash: 0 }
  );
}
