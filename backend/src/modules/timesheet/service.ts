import { NextFunction, Request, RequestHandler, Response } from "express";
import TimesheetRepository from "../../repository/timesheetRepository";
import ActivityRepository from "../../repository/activityRepository";
import {
  asyncHandler,
  RequestError,
} from "../../utils/errorHandler/errorHandler";
import { SuccessResponse } from "../../utils/responses/responses";
import {
  IsNull,
  Not,
  MoreThanOrEqual,
  LessThanOrEqual,
  Between,
} from "typeorm";
import { getTimesheetSocketService } from "../../utils/sockets/timesheetSocket";

// Start a timesheet for an activity
const startTimesheet: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.id;
    const { activityId, startTime } = req.body;

    // Check if the activity exists and is accessible to the user
    const activity = await ActivityRepository.findOne({
      where: [
        { id: activityId, userId: 0 }, // Global activity
        { id: activityId, userId }, // User's custom activity
      ],
    });

    if (!activity) {
      throw new RequestError("Activity not found or not accessible", 404);
    }

    // Create new timesheet - database constraint will prevent duplicates
    const timesheet = TimesheetRepository.create({
      userId,
      activityId,
      startTime: new Date(startTime),
      endTime: null,
    });

    try {
      const savedTimesheet = await TimesheetRepository.save(timesheet);

      // Fetch the complete timesheet with activity details
      const completeTimesheet = await TimesheetRepository.findOne({
        where: { id: savedTimesheet.id },
        relations: ["activity"],
      });

      // Emit socket event for real-time sync across devices
      const socketService = getTimesheetSocketService();
      if (socketService) {
        socketService.notifyTimesheetStarted(userId, completeTimesheet);
      }

      return SuccessResponse(
        res,
        {
          data: completeTimesheet,
          message: "Timesheet started successfully",
        },
        201
      );
    } catch (error: any) {
      // Handle database constraint violation (duplicate running timesheet)
      if (error.code === "ER_DUP_ENTRY" || error.code === "23505") {
        throw new RequestError(
          "You already have a running timesheet. Please stop it before starting a new one.",
          409
        );
      }
      throw error;
    }
  }
);

// Stop the running timesheet
const stopTimesheet: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.id;
    const { endTime } = req.body;

    // Find the running timesheet
    const runningTimesheet = await TimesheetRepository.findOne({
      where: {
        userId,
        endTime: IsNull(),
      },
      relations: ["activity"],
    });

    if (!runningTimesheet) {
      throw new RequestError("No running timesheet found", 404);
    }

    // Validate that endTime is after startTime
    const endDateTime = new Date(endTime);
    if (endDateTime <= runningTimesheet.startTime) {
      throw new RequestError("End time must be after start time", 400);
    }

    // Update the timesheet with end time
    runningTimesheet.endTime = endDateTime;
    const updatedTimesheet = await TimesheetRepository.save(runningTimesheet);

    // Calculate duration in minutes
    const durationMs =
      endDateTime.getTime() - runningTimesheet.startTime.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));

    const responseData = {
      ...updatedTimesheet,
      durationMinutes,
    };

    // Emit socket event for real-time sync across devices
    const socketService = getTimesheetSocketService();
    if (socketService) {
      socketService.notifyTimesheetStopped(userId, responseData);
    }

    return SuccessResponse(
      res,
      {
        data: responseData,
        message: "Timesheet stopped successfully",
      },
      200
    );
  }
);

// Get current running timesheet
const getCurrentTimesheet: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.id;

    const runningTimesheet = await TimesheetRepository.findOne({
      where: {
        userId,
        endTime: IsNull(),
      },
      relations: ["activity"],
    });

    if (!runningTimesheet) {
      return SuccessResponse(
        res,
        {
          data: null,
          message: "No running timesheet found",
        },
        200
      );
    }

    // Calculate current duration in minutes
    const currentTime = new Date();
    const durationMs =
      currentTime.getTime() - runningTimesheet.startTime.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));

    return SuccessResponse(
      res,
      {
        data: {
          ...runningTimesheet,
          durationMinutes,
        },
        message: "Current timesheet retrieved successfully",
      },
      200
    );
  }
);

// Get user's timesheets with pagination and filtering
const getUserTimesheets: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.id;
    const { page = 1, limit = 10, startDate, endDate, activityId } = req.query;

    // Build where conditions
    const whereConditions: any = {
      userId,
      endTime: Not(IsNull()), // Only completed timesheets
    };

    if (activityId) {
      whereConditions.activityId = parseInt(activityId as string);
    }

    // Handle date filtering
    if (startDate && endDate) {
      whereConditions.startTime = Between(
        new Date(startDate as string),
        new Date(endDate as string)
      );
    } else if (startDate) {
      whereConditions.startTime = MoreThanOrEqual(
        new Date(startDate as string)
      );
    } else if (endDate) {
      whereConditions.startTime = LessThanOrEqual(new Date(endDate as string));
    }

    // Calculate pagination
    const skip = ((page as number) - 1) * (limit as number);

    // Get timesheets with total count
    const [timesheets, total] = await TimesheetRepository.findAndCount({
      where: whereConditions,
      relations: ["activity"],
      order: { startTime: "DESC" },
      skip,
      take: limit as number,
    });

    // Calculate duration for each timesheet
    const timesheetsWithDuration = timesheets.map((timesheet) => {
      if (timesheet.endTime) {
        const durationMs =
          timesheet.endTime.getTime() - timesheet.startTime.getTime();
        const durationMinutes = Math.round(durationMs / (1000 * 60));
        return {
          ...timesheet,
          durationMinutes,
        };
      }
      return timesheet;
    });

    const totalPages = Math.ceil(total / (limit as number));

    return SuccessResponse(
      res,
      {
        data: {
          timesheets: timesheetsWithDuration,
          pagination: {
            page: page as number,
            limit: limit as number,
            total,
            totalPages,
            hasNext: (page as number) < totalPages,
            hasPrev: (page as number) > 1,
          },
        },
        message: "Timesheets retrieved successfully",
      },
      200
    );
  }
);

// Get a specific timesheet by ID
const getTimesheetById: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.id;
    const { id } = req.params;

    const timesheet = await TimesheetRepository.findOne({
      where: {
        id: parseInt(id),
        userId,
      },
      relations: ["activity"],
    });

    if (!timesheet) {
      throw new RequestError("Timesheet not found", 404);
    }

    // Calculate duration if timesheet is completed
    let durationMinutes = null;
    if (timesheet.endTime) {
      const durationMs =
        timesheet.endTime.getTime() - timesheet.startTime.getTime();
      durationMinutes = Math.round(durationMs / (1000 * 60));
    } else {
      // Calculate current duration for running timesheet
      const currentTime = new Date();
      const durationMs = currentTime.getTime() - timesheet.startTime.getTime();
      durationMinutes = Math.round(durationMs / (1000 * 60));
    }

    return SuccessResponse(
      res,
      {
        data: {
          ...timesheet,
          durationMinutes,
        },
        message: "Timesheet retrieved successfully",
      },
      200
    );
  }
);

// Delete a timesheet (only if it's stopped)
const deleteTimesheet: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.id;
    const { id } = req.params;

    const timesheet = await TimesheetRepository.findOne({
      where: {
        id: parseInt(id),
        userId,
      },
    });

    if (!timesheet) {
      throw new RequestError("Timesheet not found", 404);
    }

    // Don't allow deletion of running timesheets
    if (!timesheet.endTime) {
      throw new RequestError(
        "Cannot delete a running timesheet. Please stop it first.",
        400
      );
    }

    await TimesheetRepository.remove(timesheet);

    // Emit socket event for real-time sync across devices
    const socketService = getTimesheetSocketService();
    if (socketService) {
      socketService.notifyTimesheetDeleted(userId, timesheet.id);
    }

    return SuccessResponse(
      res,
      {
        data: null,
        message: "Timesheet deleted successfully",
      },
      200
    );
  }
);

export default {
  startTimesheet,
  stopTimesheet,
  getCurrentTimesheet,
  getUserTimesheets,
  getTimesheetById,
  deleteTimesheet,
};
