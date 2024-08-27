import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { User } from "./userModel";
import bcrypt from "bcrypt";

// Function to validate request body
const validateUserData = (name: string, email: string, password: string) => {
  if (!name || !email || !password) {
    throw createHttpError(400, "All fields are required");
  }
};

// Function to check if the user already exists
const checkIfUserExists = async (email: string) => {
  const user = await User.findOne({ email }); // in javascript if the key and value of object are same you can write like this.

  if (user) {
    throw createHttpError(400, "User already exists with this email");
  }
};

// Function to hash the password
const hashPassword = async (password: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Main controller function
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    // Step 1: Validate request data
    validateUserData(name, email, password);

    // Step 2: Check if user already exists
    await checkIfUserExists(email);

    // Step 3: Hash the password
    const hashedPassword = await hashPassword(password);

    // Step 4: Create the user in the database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Step 5: Respond with success message and user ID
    res.json({
      message: "User created successfully",
      id: newUser._id,
    });
  } catch (error) {
    // Pass errors to the next middleware
    next(error);
  }
};

export { createUser };
