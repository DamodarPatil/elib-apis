import path from "node:path";
import express from "express";
import {
  createBook,
  deleteBook,
  getSingleBook,
  listBooks,
  updateBook,
} from "./bookController";
import multer from "multer";
import authenticate from "../middleware/authenticate";

// Configure multer for handling file uploads
const upload = multer({
  // Specify the destination directory for uploaded files
  dest: path.resolve(__dirname, "../../public/data/uploads"),

  // Set file size limit (10MB)
  limits: { fileSize: 1e7 }, // 10MB

  // Filter to accept only specific file types
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];

    // Check if the file's MIME type is allowed
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error("Invalid file type. Only JPEG, PNG, and PDF are allowed.")
      );
    }
    // Proceed if the file type is valid
    cb(null, true);
  },
});

// Create a new Express router for book-related routes
const bookRouter = express.Router();

// Define routes

// POST /api/books
// Route to create a new book
// Requires authentication and supports file uploads for cover image and file
bookRouter.post(
  "/",
  authenticate, // Middleware to check for valid user authentication
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook // Controller function to handle book creation
);

// PATCH /api/books/:bookId
// Route to update an existing book
// Requires authentication and supports file uploads for cover image and file
bookRouter.patch(
  "/:bookId",
  authenticate, // Middleware to check for valid user authentication
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook // Controller function to handle book updates
);

// GET /api/books
// Route to list all books
bookRouter.get("/", listBooks); // Controller function to list books

// GET /api/books/:bookId
// Route to get details of a single book by its ID
bookRouter.get("/:bookId", getSingleBook); // Controller function to get a single book

// Route to delete the book
bookRouter.delete("/:bookId", authenticate, deleteBook);
export default bookRouter;
