const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const adapter = require("socket.io-redis");
const redis = require("./redis");

require("dotenv").config();

/* Handling CORS error */
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

/* Redis Adapter */
const redisAdapter = adapter({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || "6379",
  password: process.env.REDIS_PASS || "password",
});
// const redisAdapter = adapter({
//   host: "localhost",
//   port: "6379",
//   password: "password",
// });

/* Setting socket server */
const io = require("socket.io")(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://palak001-microsoft-engage-2021.netlify.app",
    ],
    methods: ["GET", "POST"],
  },
});

/* linking io with redis adapter */
io.adapter(redisAdapter);

app.use(cors(corsOptions));
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Server is running");
});

// important
io.on("connection", (socket) => {
  redis.keys("*", function (err, keys) {
    if (err) return console.log(err);
    for (var i = 0, len = keys.length; i < len; i++) {
      console.log("key: ", keys[i]);
    }
  });
  console.log(socket.id);
  socket.on("authentication", async (data) => {
    // console.log("Here's the data I recieved: ", data);

    let canConnect = await redis.setAsync(
      `users:${data.uid}`,
      socket.id,
      "NX",
      "EX",
      30
    );
    if (!canConnect) {
      console.log("Already Logged In");
      console.log(socket.id + " disconnected");
      io.to(socket.id).emit("InvalidSession");
      if (socket.user) {
        await redis.delAsync(`users:${socket.user.uid}`);
      }
      socket.disconnect();
    } else {
      socket.user = data;
      console.log(socket.user);
      io.to(socket.id).emit("authenticated");
      console.log("Welcome");

      // redis renewel
      socket.conn.on("packet", async (packet) => {
        console.log("Thinking of renewing the key");
        console.log("socket.auth: ", socket.auth);
        console.log("packet type: ", packet.type);
        if (packet.type === "pong") {
          console.log("received a pong");
          await redis.setAsync(
            `users:${socket.user.uid}`,
            socket.id,
            "XX",
            "EX",
            30
          );
        }
      });

      // Video Call related logic
      socket.emit("yourID", socket.id);
      socket.on("disconnect", async () => {
        socket.broadcast.emit("callEnded");
        if (socket.user) {
          await redis.delAsync(`users:${socket.user.uid}`);
        }
      });

      socket.on("callUser", (data) => {
        io.to(data.userToCall).emit("callingYou", {
          signal: data.signalData,
          from: data.from,
          name: data.name,
          photoURL: data.photoURL,
          uid: data.uid,
          isReceivedCall: true,
        });
      });

      socket.on("acceptCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
      });

      socket.on("callEnded", (data) => {
        io.to(data.to).emit("callEnded");
      });

      socket.on("callRejected", (data) => {
        io.to(data.to).emit("callRejected");
      });
    }
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
