const app = require("express");
const router = app.Router();
const jwt = require("jsonwebtoken");
const config = require("../config.json").secret;
const db = require("../db/db");
const User = db.User;

let userId = null;
let sockets = {};
let pendingMessages = {};

module.exports = function(io) {
  io.use((socket, next) => {
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
    changeStatus({ id: socket.sid, status: true });

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
      changeStatus({ id: socket.sid, status: false });
      delete sockets[socket.sid];
    });
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

const changeStatus = async ({ id, status }) => {
  const user = await User.findById(id);

  if (user) {
    user.status = status;
    await user.save();
  }
};
