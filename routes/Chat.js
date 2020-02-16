const app = require("express");
const router = app.Router();
const jwt = require("jsonwebtoken");
const config = require("../config.json").secret;

let userId = null;
let sockets = {};

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
      next();
    }
  });

  io.on("connection", socket => {
    socket.sid = userId;
    sockets[userId] = socket;

    socket.on("new message", ({ recipientId, message, senderId }) => {
      if (!sockets[recipientId]) {
        console.log(recipientId, "not online");
      } else {
        sockets[recipientId].emit("new message", {
          recipientId,
          senderId,
          message: message
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(socket.sid, "disconnected");
      delete sockets[socket.sid];
    });

    // console.log(userId);
    // socket.on(userId, ({ text, id, type }) => {
    //   console.log(typeof id);
    //   socket.emit(id, text);
    // });
  });

  return router;
};
