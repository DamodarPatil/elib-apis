// We can use classes, objects, function here.

import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { User } from "./userModel";

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

  // Database call
  const user = await User.findOne({ email }); // in javascript if the key and value of object are same you cam write like this.

  if (user) {
    const error = createHttpError(400, "User already exists with this email");
    return next(error);
  }

  // password -> hash 

  // Process

  //Response

  response.json({
    message: "User Created Successfully",
  });
};

export { createUser };
