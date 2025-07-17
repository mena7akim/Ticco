import { Router } from "express";
import ProfileService from "./service";
import { authMiddleware } from "../../middleware/authMiddleware";
import { validate } from "../../validation/validationMiddleware";
import { createProfileSchema } from "../../validation/profileValidation";

const profileRouter = Router();

profileRouter.post(
  "/create",
  authMiddleware,
  validate({ body: createProfileSchema }),
  ProfileService.createProfile
);

export default profileRouter;
