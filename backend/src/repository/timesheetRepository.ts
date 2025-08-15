import { AppDataSource } from "../data-source";
import { Timesheet } from "../models/timesheet";

const TimesheetRepository = AppDataSource.getRepository(Timesheet);

export default TimesheetRepository;
