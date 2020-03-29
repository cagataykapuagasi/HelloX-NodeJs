const express = require("express");
const app = express();
const server = require("http").createServer(app);
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;
const io = require("socket.io")(server);
const { User, Other } = require("./routes");
const { Chat } = require("./services");
const jwt = require("./handlers/Jwt");
require("dotenv").config();

app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(jwt);

app.use("/chat", Chat(io));
app.use("/user", User);
app.use("*", Other);

server.listen(port, () => {
  console.log(`Running Port: ${port}`);
});
