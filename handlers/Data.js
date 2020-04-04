function userHandler(user, { token }) {
  if (user) {
    const { hash, __v, _id, salt, refresh_token, ...other } = user.toJSON();
    return { token, refresh_token, user: other };
  }
}

function userHandlerWithoutToken(user) {
  if (user) {
    const { hash, __v, _id, salt, refresh_token, ...other } = user.toJSON();

    return other;
  }
}

function getRandomNumber(max) {
  return Math.floor(Math.random() * max);
}

module.exports = { userHandler, getRandomNumber, userHandlerWithoutToken };
