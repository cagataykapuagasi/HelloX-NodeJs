const config = require("../config.json").secret;
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { originalUrl } = req;
  const path = originalUrl.replace(/\?.*$/, "");

  if (["/user/login", "/user/register"].includes(path)) {
    next();
    return;
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, config);
    req.userData = decoded;
    next();
  } catch (e) {
    if (e.message === "jwt expired") {
      res.status(401).send({ message: "Token was expired." });
    } else {
      res.status(401).send({ message: "Unauthorized." });
    }
  }
};
