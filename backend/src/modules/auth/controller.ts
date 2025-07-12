import { Router } from "express";
import AuthService from "./service";
import { authMiddleware } from "../../middleware/authMiddleware";

const authRouter = Router();

authRouter.post("/login", AuthService.login);
authRouter.post("/request-login", AuthService.requestLogin);
authRouter.get("/user", authMiddleware, AuthService.getAuthenticatedUser);
export default authRouter;
