const app = require("express");
const router = app.Router();
const {
  login,
  register,
  getUser,
  getUsers,
  getRandomUser,
  search,
  updateAbout,
  updatePhoto,
  updatePassword,
  remove
} = require("../services");
const upload = require("../handlers/Multer");

router.post("/login", Login);
router.post("/register", Register);
router.get("/all", GetUsers);
router.get("/random", GetRandomUser);
router.post("/search", Search);
router.get("/profile", GetUser);
router.post("/profile/update-about", UpdateAbout);
router.post("/profile/update-password", UpdatePassword);
router.post("/profile/update-photo", upload.single("photo"), UpdatePhoto);
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

function UpdateAbout(req, res, next) {
  console.log("update-about");

  updateAbout(req)
    .then(r => res.send(r))
    .catch(message => res.status(400).send({ message }));
}

function UpdatePhoto(req, res, next) {
  console.log("update photo", req.file);

  updatePhoto(req)
    .then(r => res.send(r))
    .catch(message => res.status(400).send({ message }));
}

function UpdatePassword(req, res, next) {
  console.log("update-password");

  updatePassword(req)
    .then(r => res.send(r))
    .catch(message => res.status(400).send({ message }));
}

function Remove(req, res, next) {
  remove(req)
    .then(r => res.send(r))
    .catch(message => res.status(404).send({ message }));
}

module.exports = router;
