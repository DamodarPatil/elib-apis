import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { User } from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const validateUserData = (
  name: string,
  email: string,
  password: string
): void => {
  if (!name || !email || !password) {
    throw createHttpError(400, "All fields are required");
  }
};

const checkIfUserExists = async (email: string): Promise<void> => {
  const user = await User.findOne({ email });
  if (user) {
    throw createHttpError(400, "User already exists with this email");
  }
};

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const generateToken = (userId: string): string => {
  return sign({ sub: userId }, config.jwtSecret as string, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
};

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    validateUserData(name, email, password);

    await checkIfUserExists(email);

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      message: "User created successfully",
      id: newUser._id,
      accessToken: token,
    });
  } catch (error) {
    next(error);
  }
};


export { registerUser, loginUser };
