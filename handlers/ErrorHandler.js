const userErrors = ({ password, username, email }) => {
  if (!password && !username && !email) {
    return "Password, username or email is required.";
  }

  return null;
};

const registerErrors = ({ password, username, email }) => {
  if (!password) {
    return "Password is required.";
  }

  if (!username) {
    return "Username is required.";
  }

  if (!email) {
    return "Email is required.";
  }

  return null;
};

module.exports = { userErrors, registerErrors };
