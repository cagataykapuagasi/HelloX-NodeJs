const app = require("express");
const router = app.Router();
const jwt = require("jsonwebtoken");
const config = require("../config.json").secret;

let userId = null;
let sockets = {};
let pendingMessages = {};

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

    if (pendingMessages[userId]) {
      pendingMessages[userId].messages.forEach(message =>
        sockets[userId].emit("new message", message)
      );

      delete pendingMessages[userId];
    }

    socket.on("new message", ({ recipientId, message, senderId }) => {
      const newMessage = { recipientId, senderId, message: message };

      if (!sockets[recipientId]) {
        addToPending(recipientId, newMessage);
      } else {
        sockets[recipientId].emit("new message", newMessage);
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

const addToPending = (id, message) => {
  if (pendingMessages[id]) {
    pendingMessages[id].messages.push(message);
  } else {
    pendingMessages[id] = { messages: [] };
    pendingMessages[id].messages.push(message);
  }
};
