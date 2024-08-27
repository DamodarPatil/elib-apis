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
  { timestamps: true }
);

export const User = mongoose.model<UserType>("User", userSchema);
// mongoose.model("User", userSchema, "authors");  if you want to overwrite the collection name you can use third parameter as overwritten name