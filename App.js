const express = require("express");
const app = express();
const server = require("http").createServer(app);
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const io = require("socket.io")(server);
const { User, Other, Chat } = require("./routes");
const jwt = require("./handlers/Jwt");

app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(jwt);

app.use("/chat", Chat(io));
app.use("/user", User);
app.use("*", Other);

server.listen(port, () => {
  console.log(`Port: ${port}`);
});
