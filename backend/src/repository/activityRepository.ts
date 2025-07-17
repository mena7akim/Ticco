import { AppDataSource } from "../data-source";
import { Activity } from "../models/activity";

const ActivityRepository = AppDataSource.getRepository(Activity);

export default ActivityRepository;
