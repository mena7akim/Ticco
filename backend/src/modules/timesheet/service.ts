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

const startTimesheet: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.id;
    const { activityId, startTime } = req.body;

    const activity = await ActivityRepository.findOne({
      where: [
        { id: activityId, userId: 0 },
        { id: activityId, userId },
      ],
    });

    if (!activity) {
      throw new RequestError("Activity not found or not accessible", 404);
    }

    const timesheet = TimesheetRepository.create({
      userId,
      activityId,
      startTime: new Date(startTime),
      endTime: null,
    });

    try {
      const savedTimesheet = await TimesheetRepository.save(timesheet);

      const completeTimesheet = await TimesheetRepository.findOne({
        where: { id: savedTimesheet.id },
        relations: ["activity"],
      });

      const socketService = getTimesheetSocketService();
      if (socketService) {
        socketService.sync();
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

const stopTimesheet: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.id;
    const { endTime } = req.body;

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

    const endDateTime = new Date(endTime);
    if (endDateTime <= runningTimesheet.startTime) {
      throw new RequestError("End time must be after start time", 400);
    }

    runningTimesheet.endTime = endDateTime;
    const updatedTimesheet = await TimesheetRepository.save(runningTimesheet);

    const durationMs =
      endDateTime.getTime() - runningTimesheet.startTime.getTime();
    const durationMinutes = Math.round(durationMs / (1000 * 60));

    const responseData = {
      ...updatedTimesheet,
      durationMinutes,
    };

    const socketService = getTimesheetSocketService();
    if (socketService) {
      socketService.sync();
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

    return SuccessResponse(
      res,
      {
        data: {
          ...runningTimesheet,
        },
        message: "Current timesheet retrieved successfully",
      },
      200
    );
  }
);

const getUserTimesheets: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.id;
    const { page = 1, limit = 10, startDate, endDate, activityId } = req.query;

    const whereConditions: any = {
      userId,
      endTime: Not(IsNull()),
    };

    if (activityId) {
      whereConditions.activityId = parseInt(activityId as string);
    }

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

    const skip = ((page as number) - 1) * (limit as number);

    const [timesheets, total] = await TimesheetRepository.findAndCount({
      where: whereConditions,
      relations: ["activity"],
      order: { startTime: "DESC" },
      skip,
      take: limit as number,
    });

    const totalPages = Math.ceil(total / (limit as number));

    return SuccessResponse(
      res,
      {
        data: {
          timesheets: timesheets,
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

    return SuccessResponse(
      res,
      {
        data: {
          ...timesheet,
        },
        message: "Timesheet retrieved successfully",
      },
      200
    );
  }
);

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

    const socketService = getTimesheetSocketService();
    if (socketService) {
      socketService.sync();
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
