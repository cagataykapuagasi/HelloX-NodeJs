const config = require("../config.json");
const jwt = require("jsonwebtoken");
const db = require("../db/db");
const User = db.User;
const {
  userHandler,
  getRandomNumber,
  userHandlerWithoutToken
} = require("../handlers/Data");
const { userErrors, registerErrors } = require("../handlers/ErrorHandler");

module.exports = {
  login,
  getUser,
  getUsers,
  getRandomUser,
  search,
  register,
  update,
  updatePassword,
  remove
};

async function login({ username, password }) {
  return new Promise(async (resolve, reject) => {
    const user = await User.findOne({ username });

    if (user && user.validPassword(password)) {
      const token = jwt.sign({ sub: user.id }, config.secret);
      const data = userHandler(user, token);

      resolve(data);
    } else if (user) {
      reject("Password is incorrect.");
    }

    reject("Username is incorrect.");
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

async function getRandomUser(req) {
  let users = await User.find();

  if (users && users.length > 1) {
    users = users.filter(({ id, status }) => id !== req.userData.sub && status);
    const user = userHandler(users[getRandomNumber(users.length - 1)]);
    return Promise.resolve(user);
  }
  return Promise.reject("User not found.");
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

async function updatePassword(req) {
  const {
    body,
    userData: { sub }
  } = req;

  return new Promise((resolve, reject) => {
    User.findById(sub)
      .then(async user => {
        if (!body.password) {
          reject("Password is required.");
          return;
        }

        if (user.validPassword(body.password)) {
          reject("Please enter a different password.");
          return;
        }

        body.hash = user.setPassword(body.password);

        Object.assign(user, body.hash);
        resolve("Password was updated.");

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
    (err, res) => {
      if (err) {
        return err;
      }

      const users = res.map(user => userHandlerWithoutToken(user));

      return users;
    }
  );
}
