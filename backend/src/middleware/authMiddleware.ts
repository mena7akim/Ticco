import { NextFunction, Request, Response } from "express";
import { verifyJWT } from "../utils/security/jwt";
import {
  createProfileError,
  unauthorizedError,
} from "../utils/errorHandler/errorHandler";
import UserRepository from "../repository/userRepository";
import { asyncHandler } from "../utils/errorHandler/errorHandler";

export const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      next(unauthorizedError());
      return;
    }

    let decoded;
    try {
      decoded = verifyJWT(token);
    } catch (error) {
      next(unauthorizedError());
      return;
    }
    if (!decoded) {
      next(unauthorizedError());
      return;
    }

    const user = await UserRepository.findOne({
      where: { id: decoded.id },
    });

    if (!user) {
      next(unauthorizedError());
      return;
    }

    req.user = user;
    next();
  }
);

export const createProfileMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { user } = req;

    if (!user) {
      next(unauthorizedError());
      return;
    }

    if (!user.firstName) {
      next(createProfileError());
      return;
    }

    next();
  }
);
