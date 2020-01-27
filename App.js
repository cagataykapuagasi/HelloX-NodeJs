const app = require("express")();
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const { User, Other } = require("./routes");
const jwt = require("./handlers/Jwt");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(jwt);

app.use("/user", User);
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).send({ message: "Unauthorized" });
  }
});

app.use("*", Other);

app.listen(port, () => {
  console.log(`Port: ${port}`);
});
