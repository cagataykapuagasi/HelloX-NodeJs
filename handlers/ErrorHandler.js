const userErrors = ({ password, username, email }) => {
  if (!password && !username && !email) {
    return "Password, username or email is required";
  }

  return null;
};

module.exports = { userErrors };
