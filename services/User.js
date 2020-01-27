const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db/db");
const User = db.User;
const userHandler = require("../handlers/Data");
const { userErrors } = require("../handlers/ErrorHandler");

module.exports = {
  login,
  getUser,
  register,
  update,
  remove
};

async function login({ username, password }) {
  return new Promise(async (resolve, reject) => {
    const user = await User.findOne({ username });

    if (user && user.validPassword(password)) {
      //const { hash, __v, _id, salt, ...other } = user.toJSON();
      const token = jwt.sign({ sub: user.id }, config.secret);

      const data = userHandler(user, token);

      resolve(data);
    } else if (user) {
      reject("Password is incorrect");
    }

    reject("Username is incorrect");
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
      reject(`Username ${userParam.username} is already taken`);
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
          user.username !== body.username &&
          (await User.findOne({ username: body.username }))
        ) {
          reject('Username "' + body.username + '" is already taken');
          return;
        }

        const error = userErrors(body);

        if (error) {
          reject(error);
          return;
        }

        const newUser = body;
        Object.assign(user, newUser);
        resolve(user);

        await user.save();
      })
      .catch(e => reject("User not found"));
  });
}

async function remove(req) {
  return User.findByIdAndRemove(req.userData.sub)
    .then(res => res)
    .catch(e => e);
}
