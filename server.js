const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const cors = require("cors");
const PORT = process.env.PORT || 8000;

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// socket.emit => only to that particular socket will receive the event
// io.emit => all the sockets connected to the io will revieve this

// notify when user connect to the server
// io is kind of a whole device with lots of sockets
// socket is kind of a plug that connects to a socket in the device io
io.on("connection", (socket) => {
  socket.emit("yourID", socket.id);
  // emit to all the users to update their all users list.
  io.sockets.emit("allUsers", user);
  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

server.listen(PORT, () => console.log("Server is running on port 8000"));
