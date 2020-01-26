const app = require("express");
const router = app.Router();
const { login, register, getUser, update, remove } = require("../services");

router.get("/login", Login);
router.post("/register", Register);
router.get("/profile", GetUser);
router.post("/update", Update);
router.delete("/remove", Remove);

function Login(req, res, next) {
  login(req.body)
    .then(user => res.json(user))
    .catch(message => res.status(400).send({ message }));
}

function Register(req, res, next) {
  register(req.body)
    .then(user => res.json(user))
    .catch(message => res.status(400).send({ message }));
}

function GetUser(req, res, next) {
  getUser(req.body)
    .then(user => res.json(user))
    .catch(message => res.status(400).send({ message }));
}

function Update(req, res, next) {
  update(req.body)
    .then(user => res.json(user))
    .catch(message => res.status(400).send({ message }));
}

function Remove(req, res, next) {
  remove(req.body)
    .then(user => res.json(user))
    .catch(message => res.status(400).send({ message }));
}

module.exports = router;
