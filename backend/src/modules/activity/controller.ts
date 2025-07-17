import { Router } from "express";
import ActivityService from "./service";
import { authMiddleware } from "../../middleware/authMiddleware";

const activityRouter = Router();

// Get all global activities (public)
activityRouter.get("/global", ActivityService.getGlobalActivities);

// Protected routes that require authentication
activityRouter.get("/user", authMiddleware, ActivityService.getUserActivities);
activityRouter.get("/all", authMiddleware, ActivityService.getAllActivities);
activityRouter.post(
  "/user",
  authMiddleware,
  ActivityService.createUserActivity
);
activityRouter.put(
  "/user/:id",
  authMiddleware,
  ActivityService.updateUserActivity
);
activityRouter.delete(
  "/user/:id",
  authMiddleware,
  ActivityService.deleteUserActivity
);

export default activityRouter;
