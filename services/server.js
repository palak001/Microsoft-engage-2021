const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// temp storage
const user = {};

// socket.emit => only to that particular socket will receive the event
// io.emit => all the sockets connected to the io will revieve this

// notify when user connect to the server
// io is kind of a whole device with lots of sockets
// socket is kind of a plug that connects to a socket in the device io
io.on("connection", (socket) => {
  if (!user[socket.id]) {
    user[socket.id] = socket.id;
  }

  socket.emit("yourID", socket.id);

  // add on disconnect

  // emit to all the users to update their all users list.
  io.sockets.emit("allUsers", user);
  socket.on("disconnect", () => {
    delete user[socket.id];
  });

  socket.on("callUser", (data) => {
    // console.log("call user data: " + data);
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

server.listen(8000, () => console.log("Yay! Server is running on port 8000"));
