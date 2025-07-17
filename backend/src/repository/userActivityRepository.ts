import { AppDataSource } from "../data-source";
import { UserActivity } from "../models/userActivity";

const UserActivityRepository = AppDataSource.getRepository(UserActivity);

export default UserActivityRepository;
