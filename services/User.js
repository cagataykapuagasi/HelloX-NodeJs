const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db/db");
const User = db.User;

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

    if (user && bcrypt.compareSync(password, user.hash)) {
      const { hash, __v, _id, ...other } = user.toJSON();
      const token = jwt.sign({ sub: user.id }, config.secret);

      resolve(other, token);
    } else if (user) {
      reject("Password is incorrect");
    }

    reject("Username is incorrect");
  });
}

async function getUser(id) {
  return new Promise((resolve, reject) => {
    User.findById(id)
      .then(user => {
        resolve(user);
      })
      .catch(e => reject("User not found"));
  });
}

async function register(userParam) {
  return new Promise(async (resolve, reject) => {
    if (await User.findOne({ username: userParam.username })) {
      reject(`Username ${userParam.username} is already taken`);
      return;
    }

    const user = new User(userParam);
    // hash password
    user.hash = bcrypt.hashSync(userParam.password, 10);
    // save user
    await user.save();
    const token = jwt.sign({ sub: user.id }, config.secret);
    resolve(...user, token);
  });
}

async function update(id, userParam) {
  const user = await User.findById(id);

  return new Promise(async (resolve, reject) => {
    if (!user) {
      reject("User not found");
      return;
    }

    if (
      user.username !== userParam.username &&
      (await User.findOne({ username: userParam.username }))
    ) {
      reject('Username "' + userParam.username + '" is already taken');
      return;
    }

    userParam.hash = bcrypt.hashSync(userParam.password, 10);
    Object.assign(user, userParam);
    await user.save();

    resolve(user);
  });
}

async function remove(id) {
  return User.findByIdAndRemove(id)
    .then(res => res)
    .catch(e => e);
}
