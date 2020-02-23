function userHandler(user, token) {
  if (user) {
    const { hash, __v, _id, salt, ...other } = user.toJSON();
    return { token, user: other };
  }
}

function userHandlerWithoutToken(user) {
  if (user) {
    const { hash, __v, _id, salt, ...other } = user.toJSON();

    return other;
  }
}

function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}

module.exports = { userHandler, getRandomNumber, userHandlerWithoutToken };
