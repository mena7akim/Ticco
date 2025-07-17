import { NextFunction, Request, RequestHandler, Response } from "express";
import UserRepository from "../../repository/userRepository";
import {
  asyncHandler,
  RequestError,
} from "../../utils/errorHandler/errorHandler";
import { SuccessResponse } from "../../utils/responses/responses";

const createProfile: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { body, user } = req;

    await UserRepository.update({ id: user.id }, body);

    return SuccessResponse(
      res,
      {
        message: "Profile created successfully",
      },
      201
    );
  }
);

export default { createProfile };
