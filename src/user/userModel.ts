import mongoose from "mongoose";
import { User as UserType } from "./userTypes";

const userSchema = new mongoose.Schema<UserType>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manage `createdAt` and `updatedAt` fields
  }
);

export const User = mongoose.model<UserType>("User", userSchema);

// Note: You can specify a custom collection name by passing a third argument to the model function, e.g.:
// export const User = model<UserType>("User", userSchema, "authors");
