function userHandler(user, token) {
  if (user) {
    console.log(user);
    const { hash, __v, _id, salt, ...other } = user.toJSON();
    return { token, user: other };
  }
}

function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}

module.exports = { userHandler, getRandomNumber };
