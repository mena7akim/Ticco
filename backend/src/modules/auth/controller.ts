import { Router } from "express";
import AuthService from "./service";
import { authMiddleware } from "../../middleware/authMiddleware";
import { validate } from "../../validation/validationMiddleware";
import {
  requestLoginSchema,
  loginSchema,
} from "../../validation/authValidation";

const authRouter = Router();

authRouter.post("/login", validate({ body: loginSchema }), AuthService.login);
authRouter.post(
  "/request-login",
  validate({ body: requestLoginSchema }),
  AuthService.requestLogin
);
authRouter.get("/user", authMiddleware, AuthService.getAuthenticatedUser);

export default authRouter;
