import { Router } from "express";
import TimesheetService from "./service";
import { authMiddleware } from "../../middleware/authMiddleware";
import { validate } from "../../validation/validationMiddleware";
import {
  startTimesheetSchema,
  stopTimesheetSchema,
  timesheetIdParamSchema,
  getTimesheetsSchema,
} from "../../validation/timesheetValidation";

const timesheetRouter = Router();

timesheetRouter.use(authMiddleware);

timesheetRouter.post(
  "/start",
  validate({ body: startTimesheetSchema }),
  TimesheetService.startTimesheet
);

timesheetRouter.post(
  "/stop",
  validate({ body: stopTimesheetSchema }),
  TimesheetService.stopTimesheet
);

timesheetRouter.get("/current", TimesheetService.getCurrentTimesheet);

timesheetRouter.get(
  "/",
  validate({ query: getTimesheetsSchema }),
  TimesheetService.getUserTimesheets
);

timesheetRouter.get(
  "/:id",
  validate({ params: timesheetIdParamSchema }),
  TimesheetService.getTimesheetById
);

timesheetRouter.delete(
  "/:id",
  validate({ params: timesheetIdParamSchema }),
  TimesheetService.deleteTimesheet
);

export default timesheetRouter;
