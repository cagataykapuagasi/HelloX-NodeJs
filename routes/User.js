const app = require("express");
const router = app.Router();
const {
  login,
  register,
  getUser,
  getUsers,
  getRandomUser,
  search,
  update,
  remove,
  updatePassword
} = require("../services");
//const Other = require("./Other");

router.post("/login", Login);
router.post("/register", Register);
router.get("/all", GetUsers);
router.get("/random", GetRandomUser);
router.post("/search", Search);
router.get("/profile", GetUser);
router.post("/profile", Update);
router.post("/profile/update-password", UpdatePassword);
router.delete("/profile", Remove);

function Login(req, res, next) {
  console.log("login");
  login(req.body)
    .then(user => res.status(200).send(user))
    .catch(message => res.status(400).send({ message }));
}

function Register(req, res, next) {
  console.log("register");
  register(req)
    .then(user => res.send(user))
    .catch(message => res.status(400).send({ message }));
}

function GetUser(req, res, next) {
  console.log("get user");
  getUser(req)
    .then(user => res.send(user))
    .catch(message => res.status(404).send({ message }));
}

function GetUsers(req, res, next) {
  console.log("get users");
  getUsers(req)
    .then(user => res.send(user))
    .catch(message => res.status(404).send({ message }));
}

function GetRandomUser(req, res, next) {
  console.log("get random user");
  getRandomUser(req)
    .then(user => res.send(user))
    .catch(message => res.status(404).send({ message }));
}

function Search(req, res, next) {
  console.log("search");
  search(req)
    .then(users => res.send(users))
    .catch(message => res.status(400).send({ message }));
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
