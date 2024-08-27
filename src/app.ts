import express, { NextFunction, Request, Response } from "express";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app = express();

app.get("/", (request: Request, response: Response, next: NextFunction) => {
  response.json({
    message: "Welcome",
  });
});

// Global error handler
app.use(globalErrorHandler);

export default app;
