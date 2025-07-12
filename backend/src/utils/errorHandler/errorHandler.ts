import { Request, Response, NextFunction } from "express";

export class RequestError extends Error {
  cause: number;
  constructor(message: string, cause: number) {
    super(message);
    this.cause = cause;
  }
}

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((error: Error) => {
      console.error(error);
      res.status(500).json({
        status: "FAILED",
        result: {
          message: "Internal Server Error",
        },
      });
      return;
    });
  };
};

export const globalErrorHandling = (
  error: RequestError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);
  res.status(error.cause || 400).json({
    status: "FAILED",
    result: {
      message: error.message,
    },
  });
  return;
};

class UnauthorizedError extends Error {
  cause: number;
  constructor(
    message: string = "You are not authorized to perform this action."
  ) {
    super(message);
    this.cause = 401;
  }
}

export const unauthorizedError = (
  message: string = "You are not authorized to perform this action."
) => {
  return new UnauthorizedError(message);
};

export const createProfileError = (
  message: string = "User profile is incomplete. Please complete your profile."
) => {
  return new RequestError(message, 400);
};
