import { NextFunction, Request, RequestHandler, Response } from "express";
import UserRepository from "../../repository/userRepository";
import {
  asyncHandler,
  RequestError,
} from "../../utils/errorHandler/errorHandler";
import { SuccessResponse } from "../../utils/responses/responses";
import Joi from "joi";

const createProfile: RequestHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { body, user } = req;
    const schema = Joi.object({
      firstName: Joi.string().min(1).required(),
      lastName: Joi.string().min(1).required(),
      avatar: Joi.string().min(1).optional(),
    });

    const { error } = schema.validate(body);
    if (error) {
      next(new RequestError(error.details[0].message, 400));
      return;
    }

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
