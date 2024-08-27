import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";

const globalErrorHandler = (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    message: error.message || "Internal Server Error", // Error message to the client
    errorStack: config.env === "development" ? error.stack : undefined, // Stack trace only in development mode
  });
};

export default globalErrorHandler;
