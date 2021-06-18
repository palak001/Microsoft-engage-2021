const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const cors = require("cors");
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    "Access-Control-Allow-Origin": "http://localhost:3000",
    methods: "GET, PUT",
  })
);

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

const io = require("socket.io")(server, {
  cors: {
    "Access-Control-Allow-Origin": "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

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

app.get("/", cors, (req, res) => {
  res.send("Server is running");
});

server.listen(PORT, () => console.log("Server is running on port 8000"));
