import { createClient } from "redis";

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
  },
  password: process.env.REDIS_PASSWORD || "default_password",
});

redisClient.on("connect", () => {
  console.log("Redis Client Connected");
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

export default redisClient;
