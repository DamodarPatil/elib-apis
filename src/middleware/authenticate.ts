import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { verify, JwtPayload } from "jsonwebtoken";
import { config } from "../config/config";

// Extend the Request interface to include userId
export interface AuthRequest extends Request {
  userId?: string; // Make userId optional initially
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract the Authorization header
    const authHeader = req.header("Authorization");

    // Check if the token is provided and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      // Return the error to stop further processing
      return next(createHttpError(401, "Authorization token is required"));
    }

    // Extract the token from the header
    const token = authHeader.split(" ")[1];

    // Verify the token and extract the payload
    const decoded = verify(token, config.jwtSecret as string) as JwtPayload;

    // Check if the decoded token contains a subject (sub)
    if (!decoded || typeof decoded.sub !== "string") {
      // Return the error to stop further processing
      return next(createHttpError(403, "Invalid token payload"));
    }

    // Attach the userId to the request object
    (req as AuthRequest).userId = decoded.sub;

    // Proceed to the next middleware
    return next();
  } catch (error) {
    // Handle errors, such as invalid token or missing token
    if (error instanceof createHttpError.HttpError) {
      return next(error); // Return the specific HttpError
    } else {
      // Catch any other unexpected errors
      return next(createHttpError(403, "Invalid or expired token")); // Return the generic error
    }
  }
};

export default authenticate;
