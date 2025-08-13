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

// All timesheet routes require authentication
timesheetRouter.use(authMiddleware);

// Start a new timesheet
timesheetRouter.post(
  "/start",
  validate({ body: startTimesheetSchema }),
  TimesheetService.startTimesheet
);

// Stop the current running timesheet
timesheetRouter.post(
  "/stop",
  validate({ body: stopTimesheetSchema }),
  TimesheetService.stopTimesheet
);

// Get current running timesheet
timesheetRouter.get("/current", TimesheetService.getCurrentTimesheet);

// Get user's timesheets with pagination and filtering
timesheetRouter.get(
  "/",
  validate({ query: getTimesheetsSchema }),
  TimesheetService.getUserTimesheets
);

// Get a specific timesheet by ID
timesheetRouter.get(
  "/:id",
  validate({ params: timesheetIdParamSchema }),
  TimesheetService.getTimesheetById
);

// Delete a timesheet
timesheetRouter.delete(
  "/:id",
  validate({ params: timesheetIdParamSchema }),
  TimesheetService.deleteTimesheet
);

export default timesheetRouter;
