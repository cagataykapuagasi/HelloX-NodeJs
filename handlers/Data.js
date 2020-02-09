function userHandler(user, token) {
  if (user) {
    const { hash, __v, _id, salt, ...other } = user.toJSON();
    return { token, user: other };
  }
}

module.exports = userHandler;
