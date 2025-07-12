import { Response } from "express";

export const SuccessResponse = (
  res: Response,
  result?: any,
  statusCode?: number
) => {
  res.status(statusCode || 200).json({
    status: "OK",
    result,
  });
  return;
};
