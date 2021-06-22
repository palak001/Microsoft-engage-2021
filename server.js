const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const cors = require("cors");

let whitelist = [
  "http://localhost:3000",
  "https://palak001-microsoft-engage-2021.netlify.app",
];
let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://palak001-microsoft-engage-2021.netlify.app",
    ],
    methods: ["GET", "POST"],
  },
});

app.use(cors(corsOptions));
const PORT = process.env.PORT || 8000;

// socket.emit => only to that particular socket will receive the event
// io.emit => all the sockets connected to the io will revieve this

// notify when user connect to the server
// io is kind of a whole device with lots of sockets
// socket is kind of a plug that connects to a socket in the device io
io.on("connection", (socket) => {
  socket.emit("yourID", socket.id);
  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callingYou", {
      signal: data.signalData,
      from: data.from,
      isReceivedCall: true,
    });
  });

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("disconnectThisID", (id) => {
    console.log(id);
    if (id) {
      io.to(id).emit("youHaveBeenDisconnected");
      io.sockets.sockets.forEach((socket) => {
        // If given socket id is exist in list of all sockets, kill it
        if (socket.id === id) {
          console.log("found you!");
          socket.disconnect(true);
        }
      });
    }
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
