const express = require('express');
const app = express();
const routes = require('./routes/index');

const db_connection = require('./config/db_connection');
db_connection.connect();

const server = require('http').Server(app);
const io = require('socket.io')(server);
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());

routes(app);

io.on("connection", (socket) => {
  socket.on("addUser", (userID) => {
    console.log(userID)
    addUser(userID, socket.id);
    io.emit("getUser", roomMembers);
  });

  socket.on("sendMessage", ({ senderID, receiverID, text }) => {
    const user = getUser(receiverID);
    if (user) {
      io.to(user.socketID).emit("getMessage", {
        senderID,
        text,
      });
    }
  });

  socket.on("sendNotification", ({ senderID, receiverID, text }) => {
    const user = getUser(receiverID);
    if (user) {
      io.to(user.socketID).emit("getNotification", {
        senderID,
        text,
      });
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUser", roomMembers);
  });
});


app.listen(5000, () => {
  console.log(`Server is running on port http://localhost:5000`);
});

