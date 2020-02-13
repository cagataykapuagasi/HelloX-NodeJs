const app = require("express");
const router = app.Router();

router.all("*", (req, res) => {
  res.status(404).send({ message: "Not Found" });
});

module.exports = router;
