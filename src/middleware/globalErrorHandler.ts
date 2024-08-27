import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";

const globalErrorHandler = (
  error: HttpError,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  return response.status(statusCode).json({
    message: error.message || "Internal Server Error",
    errorStack: config.env === "development" ? error.stack : "", // don't use in production
  });
};

export default globalErrorHandler;
