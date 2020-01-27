function userHandler(user, token) {
  const { hash, __v, _id, salt, ...other } = user.toJSON();

  return { token, user: other };
}

module.exports = userHandler;
