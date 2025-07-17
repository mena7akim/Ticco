import express from "express";
import { bootstrap } from "./src/app";
import { AppDataSource } from "./src/data-source";
import redisClient from "./src/redis/redisClient";

const app = express();
bootstrap(app, redisClient, AppDataSource);
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
