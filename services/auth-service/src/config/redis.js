// services/auth-service/src/config/redis.js
const { createClient } = require("redis");

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

const connectRedis = async () => {
  await client.connect();
  console.log("Connected to Redis");
};

module.exports = {
  client,
  connectRedis
};