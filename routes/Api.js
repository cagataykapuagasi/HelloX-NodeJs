const router = require("express").Router();

const {
  login,
  register,
  refreshToken,
  getUser,
  getRandomUser,
  search,
  setFcm,
  updateAbout,
  updatePhoto,
  updatePassword,
  updateLanguage,
  remove
} = require("../services/User");
const upload = require("../handlers/Multer");

/* auth */

router.post("/auth/login", Login);
router.post("/auth/register", Register);
router.post("/auth/refresh_token", RefreshToken);

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

function RefreshToken(req, res, next) {
  console.log("refresh token");
  refreshToken(req)
    .then(r => res.send(r))
    .catch(message => res.status(400).send({ message }));
}

/* auth */

/* user */

router.get("/user/random", GetRandomUser);
router.post("/user/search", Search);
router.post("/user/fcm", SetFcm);
router.get("/user/profile", GetUser);
router.post("/user/profile/update-about", UpdateAbout);
router.post("/user/profile/update-password", UpdatePassword);
router.post("/user/profile/update-photo", upload.single("photo"), UpdatePhoto);
router.post("/user/profile/update-language", UpdateLanguage);
router.delete("/user/profile", Remove);

function GetUser(req, res, next) {
  console.log("get user");
  getUser(req)
    .then(user => res.send(user))
    .catch(message => res.status(404).send({ message }));
}

function UpdateLanguage(req, res, next) {
  console.log("update language");
  updateLanguage(req)
    .then(r => res.send(r))
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

function SetFcm(req, res, next) {
  console.log("set fcm");
  setFcm(req)
    .then(r => res.send(r))
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

/* user */

module.exports = router;
