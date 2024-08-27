import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { User } from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

// Helper function to validate request body
const validateUserData = (name: string, email: string, password: string): void => {
  if (!name || !email || !password) {
    throw createHttpError(400, "All fields are required");
  }
};

// Helper function to check if the user already exists
const checkIfUserExists = async (email: string): Promise<void> => {
  const user = await User.findOne({ email });
  if (user) {
    throw createHttpError(400, "User already exists with this email");
  }
};

// Helper function to hash the password
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Helper function to generate JWT token
const generateToken = (userId: string): string => {
  return sign(
    { sub: userId },
    config.jwtSecret as string,
    { expiresIn: "7d" }
  );
};

// Main controller function
const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Step 1: Validate request data
    validateUserData(name, email, password);

    // Step 2: Check if user already exists
    await checkIfUserExists(email);

    // Step 3: Hash the password
    const hashedPassword = await hashPassword(password);

    // Step 4: Create the user in the database
    const newUser = await User.create({ name, email, password: hashedPassword });

    // Step 5: Generate JWT token
    const token = generateToken(newUser._id);

    // Step 6: Respond with success message, user ID, and access token
    res.json({
      message: "User created successfully",
      id: newUser._id,
      accessToken: token,
    });
  } catch (error) {
    next(error); // Pass errors to the next middleware
  }
};

export { createUser };
