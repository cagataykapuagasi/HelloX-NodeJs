const app = require("express");
const router = app.Router();
const {
  login,
  register,
  getUser,
  update,
  remove,
  updatePassword
} = require("../services");
const Other = require("./Other");

router.get("/login", Login);
router.post("/register", Register);
router.get("/profile", GetUser);
router.post("/profile", Update);
router.post("/profile/update-password", UpdatePassword);
router.delete("/profile", Remove);

//router.use("*", Other);

function Login(req, res, next) {
  console.log("login");

  login(req.body)
    .then(user => res.status(200).send(user))
    .catch(message => res.status(400).send({ message }));
}

function Register(req, res, next) {
  register(req.body)
    .then(user => res.send(user))
    .catch(message => res.status(400).send({ message }));
}

function GetUser(req, res, next) {
  console.log("get user");
  getUser(req)
    .then(user => res.send(user))
    .catch(message => res.status(404).send({ message }));
}

function Update(req, res, next) {
  console.log("update");

  update(req)
    .then(user => res.send(user))
    .catch(message => res.status(404).send({ message }));
}

function UpdatePassword(req, res, next) {
  console.log("update-password");

  updatePassword(req)
    .then(user => res.send(user))
    .catch(message => res.status(404).send({ message }));
}

function Remove(req, res, next) {
  remove(req)
    .then(user => res.send(user))
    .catch(message => res.status(404).send({ message }));
}

module.exports = router;
