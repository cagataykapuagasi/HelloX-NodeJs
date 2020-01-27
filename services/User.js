const config = require("../config.json");
const jwt = require("jsonwebtoken");
const db = require("../db/db");
const User = db.User;
const userHandler = require("../handlers/Data");
const { userErrors } = require("../handlers/ErrorHandler");

module.exports = {
  login,
  getUser,
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
    User.findById(req.userData.sub)
      .then(user => resolve(userHandler(user)))
      .catch(e => reject(e));
  });
}

async function register(userParam) {
  return new Promise(async (resolve, reject) => {
    if (await User.findOne({ username: userParam.username })) {
      reject(`Username '${userParam.username}' is already taken.`);
      return;
    }

    const user = new User(userParam);
    user.setPassword(userParam.password);
    const token = jwt.generateJWT();
    const data = userHandler(user, token);
    resolve(data);

    await user.save();
  });
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
      .catch(e => reject(e));
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
      .catch(e => reject(e));
  });
}

async function remove(req) {
  return User.findByIdAndRemove(req.userData.sub)
    .then(res => res)
    .catch(e => e);
}
