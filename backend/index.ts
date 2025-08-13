import express from "express";
import { createServer } from "http";
import { bootstrap } from "./src/app";
import { AppDataSource } from "./src/data-source";
import redisClient from "./src/redis/redisClient";
import { TimesheetSocketServiceSingleton } from "./src/utils/sockets/timesheetSocket";

const app = express();
const httpServer = createServer(app);

new TimesheetSocketServiceSingleton(httpServer);
const socketService = TimesheetSocketServiceSingleton.getInstance();

bootstrap(app, redisClient, AppDataSource);

httpServer.listen(8000, () => {
  console.log("Server is running on port 8000");
  console.log("WebSocket server initialized for real-time timesheet sync");

  socketService.startPeriodicSync();
});
