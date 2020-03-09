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

const updatePasswordErrors = ({ user, password, new_password }) => {
  if (password.length < 6) {
    return { password: "Password must not be less than 6 characters." };
  }
  if (user.validPassword(password)) {
    if (new_password.length < 6) {
      return {
        new_password: "New Password must not be less than 6 characters."
      };
    }
    if (password === new_password) {
      return {
        new_password: "Please enter a different password."
      };
    }
  } else {
    return { password: "Password is incorrect." };
  }
};

module.exports = { userErrors, registerErrors, updatePasswordErrors };
