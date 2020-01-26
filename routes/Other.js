const app = require("express");
const router = app.Router();

router.get("*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});

router.post("*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});

router.delete("*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});

router.patch("*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});

module.exports = router;
