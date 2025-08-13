import { NextFunction, Request, RequestHandler, Response } from "express";
import ActivityRepository from "../../repository/activityRepository";
import {
  asyncHandler,
  RequestError,
} from "../../utils/errorHandler/errorHandler";
import { SuccessResponse } from "../../utils/responses/responses";

// Get all global activities
const getGlobalActivities: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const globalActivities = await ActivityRepository.find({
      where: { userId: 0 }, // Assuming global activities have userId 0
      order: { createdAt: "ASC" },
    });

    return SuccessResponse(
      res,
      {
        data: globalActivities,
        message: "Global activities retrieved successfully",
      },
      200
    );
  }
);

// Get user's custom activities
const getUserActivities: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.id;

    const userActivities = await ActivityRepository.find({
      where: { userId },
      order: { createdAt: "ASC" },
    });

    return SuccessResponse(
      res,
      {
        data: userActivities,
        message: "User activities retrieved successfully",
      },
      200
    );
  }
);

// Get all activities (global + user's custom activities)
const getAllActivities: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user.id;

    const [globalActivities, userActivities] = await Promise.all([
      ActivityRepository.find({
        where: { userId: 0 }, // Assuming global activities have userId 0
        order: { createdAt: "ASC" },
      }),
      ActivityRepository.find({
        where: { userId },
        order: { createdAt: "ASC" },
      }),
    ]);

    return SuccessResponse(
      res,
      {
        data: {
          globalActivities,
          userActivities,
        },
        message: "All activities retrieved successfully",
      },
      200
    );
  }
);

// Create a new user activity
const createUserActivity: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, color, icon } = req.body;
    const userId = req.user.id;

    const userActivity = await ActivityRepository.save({
      userId,
      name,
      color,
      icon,
    });

    return SuccessResponse(
      res,
      {
        data: userActivity,
        message: "User activity created successfully",
      },
      201
    );
  }
);

// Update a user activity
const updateUserActivity: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const { name, color, icon } = req.body;
    const userId = req.user.id;

    const userActivity = await ActivityRepository.findOne({
      where: { id: parseInt(id), userId },
    });

    if (!userActivity) {
      next(new RequestError("User activity not found", 404));
      return;
    }

    userActivity.name = name;
    userActivity.color = color;
    userActivity.icon = icon;

    const updatedActivity = await ActivityRepository.save(userActivity);

    return SuccessResponse(
      res,
      {
        data: updatedActivity,
        message: "User activity updated successfully",
      },
      200
    );
  }
);

// Delete a user activity
const deleteUserActivity: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { id } = req.params;
    const userId = req.user.id;

    const userActivity = await ActivityRepository.findOne({
      where: { id: parseInt(id), userId },
    });

    if (!userActivity) {
      next(new RequestError("User activity not found", 404));
      return;
    }

    await ActivityRepository.remove(userActivity);

    return SuccessResponse(
      res,
      {
        message: "User activity deleted successfully",
      },
      200
    );
  }
);

export default {
  getGlobalActivities,
  getUserActivities,
  getAllActivities,
  createUserActivity,
  updateUserActivity,
  deleteUserActivity,
};
