import { DataSource } from "typeorm";
import { User } from "./models/user";
import { Activity } from "./models/activity";
import "./env";
import { Timesheet } from "./models/timesheet";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNCHRONIZE === "true",
  logging: process.env.DB_LOGGING === "true",
  entities: [User, Activity, Timesheet],
  subscribers: [],
  migrations: [],
});
