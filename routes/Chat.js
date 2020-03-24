const app = require("express");
const router = app.Router();
const jwt = require("jsonwebtoken");
const db = require("../db/db");
const User = db.User;

let userId = null;
let sockets = {};
let pendingMessages = {};
let subscribers = {};

module.exports = function(io) {
  io.use((socket, next) => {
    try {
      const decoded = jwt.verify(
        socket.handshake.query.token,
        process.env.API_SECRET
      );
      userId = decoded.id;
      //console.log(decoded);
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
    console.log(socket.sid, "connected");

    if (pendingMessages[userId]) {
      pendingMessages[userId].messages.forEach(message =>
        sockets[userId].emit("new message", message)
      );

      delete pendingMessages[userId];
    }

    handleSubscription(socket);
    informToMySubscribers({ socket, status: true });

    socket.on("new message", ({ recipientId, ...other }) => {
      const newMessage = { recipientId, ...other };

      if (!sockets[recipientId]) {
        console.log("user offline adding pending", recipientId);
        addToPending(recipientId, newMessage);
      } else {
        sockets[recipientId].emit("new message", newMessage);
      }
    });

    socket.on("disconnect", () => {
      console.log(socket.sid, "disconnected");
      informToMySubscribers({ socket, status: false });
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

handleSubscription = socket => {
  socket.on("subscribe", async id => {
    if (!subscribers[id]) {
      subscribers[id] = [socket.sid];
    } else {
      subscribers[id].push(socket.sid);
    }

    const user = await User.findById(id);
    socket.emit("subscribelisten", user.status);
  });

  socket.on("unsubscribe", id => {
    if (subscribers[id]) {
      if (subscribers[id].length < 2) {
        delete subscribers[id];
      } else {
        const isSub = subscribers[id].indexOf(socket.sid);
        if (isSub !== -1) {
          subscribers[id].splice(isSub, 1);
        }
      }
    }
  });

  console.log("handleSubscription", subscribers[socket.sid]);
};

informToMySubscribers = ({ socket, status }) => {
  const subs = subscribers[socket.sid];
  console.log("subsinfo", subs, status, "myid", socket.sid);
  if (subs) {
    subs.forEach(id => {
      if (sockets[id]) {
        sockets[id].emit("subscribelisten", status);
      } else {
        if (subs.length < 2) {
          delete subscribers[socket.sid];
          return;
        }
        const subIndex = subs.indexOf(id);
        if (subIndex !== -1) {
          subs.splice(subIndex, 1);
        }
      }
    });
  }
};
