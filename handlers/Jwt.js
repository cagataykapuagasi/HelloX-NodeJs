const jwt = require("jsonwebtoken");
const config = require("../config.json").secret;

module.exports = (req, res, next) => {
  const { path } = req;

  if (!path.includes("/user")) {
    next();
    return;
  }

  console.log("test log", typeof config);

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
    console.log("jwt errpr", e);
    if (e.message === "jwt expired") {
      res.status(401).send({ message: "Token was expired." });
    } else {
      res.status(401).send({ message: "Unauthorized." });
    }
  }
};
