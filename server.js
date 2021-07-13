const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const adapter = require("socket.io-redis");
const redis = require("./redis");
const firebase = require("firebase");

require("dotenv").config();

/* Firebase related code*/
/* Firebase Config */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

/* Initialize firebase app */
firebase.initializeApp(firebaseConfig);

/* Firebase database ref */
const db = firebase.firestore();

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
/* For deployment purpose */
const redisAdapter = adapter({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || "6379",
  password: process.env.REDIS_PASS || "password",
});
/* For local testing */
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

// Socket.io server main logic
io.on("connection", (socket) => {
  redis.keys("*", function (err, keys) {
    if (err) return console.log(err);
  });

  /* Making sure the client has only one active session */
  socket.on("authentication", async (data) => {
    /* For acquiring lock on user session */
    /* Sets up key only if it doesn't already exist with an expiration of 30 sec */
    let canConnect = await redis.setAsync(
      `users:${data.uid}`,
      socket.id,
      "NX",
      "EX",
      30
    );
    /* If key cannot be set then Invalid session */
    if (!canConnect) {
      io.to(socket.id).emit("InvalidSession");
      if (socket.user) {
        await redis.delAsync(`users:${socket.user.uid}`);
      }
      socket.disconnect();
    } else {
      /* User authenticated */
      socket.user = data;
      io.to(socket.id).emit("authenticated");

      // redis key renewel as the key have expiration of 30sec
      socket.conn.on("packet", async (packet) => {
        if (packet.type === "pong") {
          /*Set the key only if it already exists */
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

      socket.on("signOut", async () => {
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
          meetingID: data.meetingID,
          isReceivedCall: true,
          meetingName: data.meetingName,
        });
      });

      socket.on("acceptedCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal);
      });

      socket.on("callEnded", (data) => {
        io.to(data.to).emit("callEnded");
      });

      socket.on("callRejected", (data) => {
        io.to(data.to).emit("callRejected");
      });

      socket.on("chat", (data) => {
        if (data.to) {
          io.to(data.to).emit("newChat", {
            from: data.from,
            message: data.message,
            senderEmail: data.senderEmail,
            meetingID: data.meetingID,
          });
        }
      });
    }
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
