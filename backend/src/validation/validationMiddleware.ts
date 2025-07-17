import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";
import { RequestError } from "../utils/errorHandler/errorHandler";

export interface ValidationOptions {
  body?: Schema;
  params?: Schema;
  query?: Schema;
}

export const validate = (schemas: ValidationOptions) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    // Validate request body
    if (schemas.body && req.body) {
      const { error } = schemas.body.validate(req.body, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map((detail) => detail.message));
      }
    }

    // Validate request parameters
    if (schemas.params && req.params) {
      const { error } = schemas.params.validate(req.params, {
        abortEarly: false,
      });
      if (error) {
        errors.push(...error.details.map((detail) => detail.message));
      }
    }

    // Validate request query
    if (schemas.query && req.query) {
      const { error } = schemas.query.validate(req.query, {
        abortEarly: false,
      });
      if (error) {
        errors.push(...error.details.map((detail) => detail.message));
      }
    }

    if (errors.length > 0) {
      next(new RequestError(errors.join(", "), 400));
      return;
    }

    next();
  };
};
