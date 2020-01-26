const app = require("express");
const router = app.Router();

router.get("*", (req, res) => {
  res.sendStatus(404);
});

router.post("*", (req, res) => {
  res.sendStatus(404);
});

router.delete("*", (req, res) => {
  res.sendStatus(404);
});

router.patch("*", (req, res) => {
  res.sendStatus(404);
});

module.exports = router;
