import mongoose from "mongoose";
import { Book as bookType } from "./bookTypes";
import { User } from "../user/userModel";

const bookSchema = new mongoose.Schema<bookType>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Book = mongoose.model<bookType>("Book", bookSchema);
