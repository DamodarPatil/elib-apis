import express, { NextFunction, Request, Response } from "express";
import globalErrorHandler from "./middleware/globalErrorHandler";
import userRouter from "./user/userRouter";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.json({
    message: "Welcome",
  });
});

app.use("/api/users", userRouter);

app.use(globalErrorHandler);

export default app;
