// We can use classes, objects, function here.

import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const createUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // Validation
  const { name, email, password } = request.body;

  if (!name || !email || !password) {
    const error = createHttpError(400, "All Fields are required");
    return next(error);
  }
  // Process

  //Response

  response.json({
    message: "User Created Successfully",
  });
};

export { createUser };
