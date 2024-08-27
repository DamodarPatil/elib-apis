import express, { NextFunction, Request, Response } from "express";
import globalErrorHandler from "./middleware/globalErrorHandler";
import userRouter from "./user/userRouter";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", (request: Request, response: Response, next: NextFunction) => {
  response.json({
    message: "Welcome",
  });
});

// Routes
app.use("/api/users", userRouter);

// Global error handler
app.use(globalErrorHandler);

export default app;
