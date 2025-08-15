import Joi from "joi";

// Schema for starting a timesheet
export const startTimesheetSchema = Joi.object({
  activityId: Joi.number().positive().required().messages({
    "number.base": "Activity ID must be a number",
    "number.positive": "Activity ID must be positive",
    "any.required": "Activity ID is required",
  }),
  startTime: Joi.date().iso().required().messages({
    "date.base": "Start time must be a valid date",
    "date.format": "Start time must be in ISO format",
    "any.required": "Start time is required",
  }),
});

// Schema for stopping a timesheet
export const stopTimesheetSchema = Joi.object({
  endTime: Joi.date().iso().required().messages({
    "date.base": "End time must be a valid date",
    "date.format": "End time must be in ISO format",
    "any.required": "End time is required",
  }),
});

// Schema for timesheet ID parameter
export const timesheetIdParamSchema = Joi.object({
  id: Joi.number().positive().required().messages({
    "number.base": "Timesheet ID must be a number",
    "number.positive": "Timesheet ID must be positive",
    "any.required": "Timesheet ID is required",
  }),
});

// Schema for getting user timesheets with optional filters
export const getTimesheetsSchema = Joi.object({
  page: Joi.number().positive().min(1).default(1).messages({
    "number.base": "Page must be a number",
    "number.positive": "Page must be positive",
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number().positive().min(1).max(100).default(10).messages({
    "number.base": "Limit must be a number",
    "number.positive": "Limit must be positive",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),
  startDate: Joi.date().iso().optional().messages({
    "date.base": "Start date must be a valid date",
    "date.format": "Start date must be in ISO format",
  }),
  endDate: Joi.date().iso().min(Joi.ref("startDate")).optional().messages({
    "date.base": "End date must be a valid date",
    "date.format": "End date must be in ISO format",
    "date.min": "End date must be after start date",
  }),
  activityId: Joi.number().positive().optional().messages({
    "number.base": "Activity ID must be a number",
    "number.positive": "Activity ID must be positive",
  }),
});
