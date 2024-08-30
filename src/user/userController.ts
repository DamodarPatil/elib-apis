import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { User } from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

// Function to validate user input data
const validateUserData = (
  name: string,
  email: string,
  password: string
): void => {
  // Check if all required fields are provided
  if (!name || !email || !password) {
    throw createHttpError(400, "All fields are required");
  }
};

// Function to check if a user already exists with the given email
const checkIfUserExists = async (email: string): Promise<void> => {
  const user = await User.findOne({ email });
  if (user) {
    throw createHttpError(400, "User already exists with this email");
  }
};

// Function to hash the user's password
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Number of rounds to generate salt for hashing
  return await bcrypt.hash(password, saltRounds); // Hash the password and return it
};

// Function to generate a JWT token for the user
const generateToken = (userId: string): string => {
  // Create and sign a JWT token with the user's ID and secret key
  return sign({ sub: userId }, config.jwtSecret as string, {
    expiresIn: "7d", // Token expiration time
    algorithm: "HS256", // Signing algorithm
  });
};

// Handler for user registration
const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Validate user data
    validateUserData(name, email, password);

    // Check if the user already exists
    await checkIfUserExists(email);

    // Hash the user's password
    const hashedPassword = await hashPassword(password);

    // Create a new user in the database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate a JWT token for the newly created user
    const token = generateToken(newUser._id);

    // Respond with success message and user details
    res.status(201).json({
      message: "User created successfully",
      id: newUser._id,
      accessToken: token,
    });
  } catch (error) {
    // Pass any errors to the next middleware
    next(error);
  }
};

// Handler for user login
const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      throw createHttpError(400, "Email and password are required");
    }

    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found, throw an error
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    // If passwords do not match, throw an error
    if (!isMatch) {
      throw createHttpError(400, "Username or password incorrect!");
    }

    // Generate a JWT token for the logged-in user
    const token = generateToken(user._id);

    // Respond with success message and user details
    res.status(200).json({
      message: "Login successful",
      id: user._id,
      accessToken: token,
    });
  } catch (error) {
    // Pass any errors to the next middleware
    return next(error);
  }
};

export { registerUser, loginUser };
