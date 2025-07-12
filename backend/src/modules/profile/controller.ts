import { Router } from "express";
import ProfileService from "./service";
import { authMiddleware } from "../../middleware/authMiddleware";

const profileRouter = Router();

profileRouter.post("/create", authMiddleware, ProfileService.createProfile);

export default profileRouter;
