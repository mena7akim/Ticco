import { Router } from "express";
import ActivityService from "./service";
import { authMiddleware } from "../../middleware/authMiddleware";
import { validate } from "../../validation/validationMiddleware";
import {
  createUserActivitySchema,
  updateUserActivitySchema,
  activityIdParamSchema,
} from "../../validation/activityValidation";

const activityRouter = Router();

// Get all global activities (public)
activityRouter.get("/global", ActivityService.getGlobalActivities);

// Protected routes that require authentication
activityRouter.get("/user", authMiddleware, ActivityService.getUserActivities);
activityRouter.get("/all", authMiddleware, ActivityService.getAllActivities);
activityRouter.post(
  "/user",
  authMiddleware,
  validate({ body: createUserActivitySchema }),
  ActivityService.createUserActivity
);
activityRouter.put(
  "/user/:id",
  authMiddleware,
  validate({
    body: updateUserActivitySchema,
    params: activityIdParamSchema,
  }),
  ActivityService.updateUserActivity
);
activityRouter.delete(
  "/user/:id",
  authMiddleware,
  validate({ params: activityIdParamSchema }),
  ActivityService.deleteUserActivity
);

export default activityRouter;
