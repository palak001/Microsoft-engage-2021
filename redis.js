const bluebird = require("bluebird");
const redis = require("redis");
require("dotenv").config();
bluebird.promisifyAll(redis);

// const client = redis.createClient({
//   url: process.env.REDIS_URL,
// });
// client.auth(process.env.REDIS_PASS);

const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

module.exports = client;
