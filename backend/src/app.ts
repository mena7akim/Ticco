import express, { Express } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import { User } from "./models/user";
import { globalErrorHandling } from "./utils/errorHandler/errorHandler";
import authRouter from "./modules/auth/controller";
import morgan from "morgan";
import cors from "cors";
import redisClient from "./redis/redisClient";
import profileRouter from "./modules/profile/controller";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Too many requests, please try again later.",
});

export const bootstrap = async (app: Express) => {
  await redisClient.connect();
  await AppDataSource.initialize()
    .then(async () => {
      console.log("Data Source has been initialized!");
      app.use(
        cors({
          origin: process.env.CORS_ORIGIN,
          methods: ["GET", "POST", "PUT", "DELETE"],
          allowedHeaders: ["Content-Type", "Authorization"],
        })
      );
      app.use(helmet());
      app.use(limiter);

      app.use(morgan("dev"));
      app.use(express.json());

      app.use("/uploads", express.static("uploads"));
      app.use("/api/auth", authRouter);
      app.use("/api/profile", profileRouter);

      app.use(globalErrorHandling);
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });
};
