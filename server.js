const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const cors = require("cors");
const firebase = require("firebase");
const adapter = require("socket.io-redis");
const redis = require("./redis");

require("dotenv").config();

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
const dbRef = db.collection("users");

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
  port: process.env.REDIS_PORT || 6379,
  token: process.env.REDIS_PASS || "token",
});

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

const authenticate = async (socket, data, callback) => {
  console.log("We are in authentication function");
  //get credentials sent by the client
  let username = data.username;
  let token = data.token;

  // find user in database
  await dbRef
    .doc(username)
    .get()
    .then(async (doc) => {
      console.log("what's up");
      if (doc.exists) {
        console.log("doc.uid", doc.data().uid);
        console.log("token: ", token);
        if (doc.data().uid === token) {
          redis.keys("*", function (err, keys) {
            if (err) return console.log(err);
            for (var i = 0, len = keys.length; i < len; i++) {
              console.log("key: ", keys[i]);
            }
          });
          let canConnect = await redis.setAsync(
            `users:${doc.data().uid}`,
            socket.id,
            "NX",
            "EX",
            30
          );
          console.log("canConnect: ", canConnect);
          if (!canConnect) {
            console.log("You are already logged in");
            return callback(new Error("ALREADY_LOGGED_IN"));
          }
          socket.user = doc.data();
          console.log("socket.user", socket.user);
          return callback(null, true);
        } else {
          return callback(new Error("Unauthorized"));
        }
      } else {
        return callback(new Error("User not Found"));
      }
    });
};

const postAuthenticate = async (socket, data) => {
  console.log(`Socket ${socket.id} authenticated.`);
  socket.conn.on("packet", async (packet) => {
    console.log("Thinking of renewing the key");
    console.log("socket.auth: ", socket.auth);
    console.log("packet type: ", packet.type);
    if (socket.auth && packet.type === "ping") {
      console.log("received a ping");
      await redis.setAsync(
        `users:${socket.user.uid}`,
        socket.id,
        "XX",
        "EX",
        30
      );
    }
  });

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
  });
};

const disconnect = async (socket) => {
  console.log(socket.id + " disconnected");
  if (socket.user) {
    await redis.delAsync(`users:${socket.user.uid}`);
  }
  // io.to(socket.id).emit("disconnect");
};

/* use socketio-auth */
require("socketio-auth")(io, {
  authenticate: authenticate,
  postAuthenticate: postAuthenticate,
  disconnect: disconnect,
  timeout: 1000,
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
