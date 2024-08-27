import express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { config } from "./config/config";

const app = express();

app.get("/", (request: Request, response: Response, next: NextFunction) => {
  const error = createHttpError(400, "Something went wrong");
  throw error;

  response.json({
    message: "Welcome",
  });
});

// Global error handler
app.use(
  (
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
  }
);

export default app;
