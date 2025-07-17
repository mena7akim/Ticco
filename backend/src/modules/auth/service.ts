import { NextFunction, Request, RequestHandler, Response } from "express";
import { generateJWT } from "../../utils/security/jwt";
import UserRepository from "../../repository/userRepository";
import {
  asyncHandler,
  RequestError,
} from "../../utils/errorHandler/errorHandler";
import { SuccessResponse } from "../../utils/responses/responses";
import emailEmitter from "../../utils/eventBus/emailEmitter";
import otpVerificationTemplate from "../../utils/email/templates/otp-verification";
import redisClient from "../../redis/redisClient";

const requestLogin: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email } = req.body;
    console.log("Requesting login for email:", email);

    const user = await UserRepository.findOne({
      where: { email },
    });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    redisClient.set(`otp:${email}`, otp, {
      EX: 300,
    });

    emailEmitter.emit("sendEmail", {
      to: email,
      subject: `${!user ? "Register on Ticksy" : "Login on Ticksy"}`,
      content: otpVerificationTemplate(otp),
    });

    return SuccessResponse(
      res,
      {
        message: "OTP sent to your email",
      },
      200
    );
  }
);

const login: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, otp } = req.body;

    const cachedOtp = await redisClient.get(`otp:${email}`);
    if (!cachedOtp || cachedOtp !== otp) {
      next(new RequestError("Invalid or expired OTP", 400));
      return;
    }
    let user = await UserRepository.findOne({
      where: { email },
    });
    if (!user) {
      await UserRepository.insert({ email });
      user = await UserRepository.findOne({
        where: { email },
      });
    }
    const token = generateJWT(user!);
    return SuccessResponse(
      res,
      {
        data: { access_token: token, user },
        message: "User logged in successfully",
      },
      200
    );
  }
);

const getAuthenticatedUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const user = req.user;
    if (!user) {
      next(new RequestError("User not authenticated", 401));
      return;
    }
    return SuccessResponse(
      res,
      {
        data: user,
        message: "Authenticated user retrieved successfully",
      },
      200
    );
  }
);

export default { login, requestLogin, getAuthenticatedUser };
