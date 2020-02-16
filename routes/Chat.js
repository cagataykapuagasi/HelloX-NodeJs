const app = require("express");
const router = app.Router();
const jwt = require("jsonwebtoken");
const config = require("../config.json").secret;

let userId = null;

module.exports = function(io) {
  io.use((socket, next) => {
    console.log(socket.handshake.query.token);

    try {
      const decoded = jwt.verify(socket.handshake.query.token, config);
      userId = decoded.sub;
      console.log(decoded);
      next();
    } catch (e) {
      socket.disconnect();
      //next(new Error("Authentication error"));
      //console.log(e);
    }
  });

  io.on("connection", socket => {
    console.log("a user connected.");

    //Object.keys(io.sockets.sockets).forEach(socketid => {
    //console.log(socketid);
    //});
    console.log(userId);
    socket.on(userId, ({ text, id, type }) => {
      console.log(text, id, type);
      socket.emit(id, text);
      //console.log("message", message);
      //socket.emit("chat message", message);
      //socket.emit("lale", "dqwjhjdqw");
      //socket.to(id).emit("message", message);
    });
  });

  return router;
};
