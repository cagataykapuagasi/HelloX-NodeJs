const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const { path } = req;

  if (!path.includes("user")) {
    next();
    return;
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.API_SECRET);
    req.userData = decoded;
    next();
  } catch ({ message }) {
    if (message === "jwt expired") {
      res.status(401).send({ message: "Token was expired." });
    } else {
      res.status(401).send({ message: "Unauthorized." });
    }
  }
};
