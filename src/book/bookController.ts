import path from "node:path";
import fs from "node:fs";
import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import createHttpError from "http-errors";
import { Book } from "./bookModel";
import { AuthRequest } from "../middleware/authenticate";

// Helper function to upload a file to Cloudinary
const uploadFileToCloudinary = async (
  filePath: string,
  options: {
    folder: string;
    format: string;
    resource_type?: "auto" | "image" | "video" | "raw";
    filename_override?: string;
  }
) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, options);
    return result.secure_url;
  } catch {
    throw createHttpError(500, "Error uploading file to Cloudinary");
  }
};

// Helper function to delete a local file
const deleteLocalFile = async (filePath: string) => {
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    console.error(`Error deleting file: ${filePath}`, error);
  }
};

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files || !files.coverImage || !files.file) {
      return next(
        createHttpError(400, "Files for cover image and book are required.")
      );
    }

    // Handle cover image upload
    const coverImage = files.coverImage[0];
    const coverImageMimeType = coverImage.mimetype.split("/").pop() || "jpg"; // Default to jpg if undefined
    const coverImagePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      coverImage.filename
    );

    const coverImageUrl = await uploadFileToCloudinary(coverImagePath, {
      filename_override: coverImage.filename,
      folder: "book-covers",
      format: coverImageMimeType,
      resource_type: "image",
    });

    // Handle book file upload
    const bookFile = files.file[0];
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFile.filename
    );

    const bookFileUrl = await uploadFileToCloudinary(bookFilePath, {
      filename_override: bookFile.filename,
      folder: "book-PDFs",
      format: "pdf",
      resource_type: "raw",
    });

    // Create the book in the database
    const newBook = await Book.create({
      title,
      genre,
      author: (req as AuthRequest).userId,
      coverImage: coverImageUrl,
      file: bookFileUrl,
    });

    // Delete temporary local files
    await deleteLocalFile(coverImagePath);
    await deleteLocalFile(bookFilePath);

    // Respond with the created book details
    return res.status(201).json({
      id: newBook._id,
      message: "Book created successfully.",
    });
  } catch (error) {
    // Handle errors consistently using createHttpError
    if (error instanceof createHttpError.HttpError) {
      next(error);
    } else {
      // Catch any other unexpected errors and log them
      console.error("Error in createBook function:", error);
      return next(
        createHttpError(500, "Error while processing the book creation.")
      );
    }
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;
    const bookId = req.params.bookId;

    const book = await Book.findOne({ _id: bookId });

    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    if (book.author.toString() !== (req as AuthRequest).userId) {
      return next(createHttpError(403, "You cannot update others' books."));
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Update cover image if new file provided
    let coverImageUrl = book.coverImage;
    if (files.coverImage) {
      const coverImage = files.coverImage[0];
      const coverImagePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        coverImage.filename
      );

      coverImageUrl = await uploadFileToCloudinary(coverImagePath, {
        filename_override: coverImage.filename,
        folder: "book-covers",
        format: coverImage.mimetype.split("/").pop() || "jpg",
        resource_type: "image",
      });

      await deleteLocalFile(coverImagePath);
    }

    // Update book file if new file provided
    let bookFileUrl = book.file;
    if (files.file) {
      const bookFile = files.file[0];
      const bookFilePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        bookFile.filename
      );

      bookFileUrl = await uploadFileToCloudinary(bookFilePath, {
        filename_override: bookFile.filename,
        folder: "book-PDFs",
        format: "pdf",
        resource_type: "raw",
      });

      await deleteLocalFile(bookFilePath);
    }

    // Update book details in the database
    const updatedBook = await Book.findOneAndUpdate(
      { _id: bookId },
      {
        title,
        genre,
        coverImage: coverImageUrl,
        file: bookFileUrl,
      },
      { new: true }
    );

    // Send the updated book details in the response
    return res.json(updatedBook);
  } catch (error) {
    if (error instanceof createHttpError.HttpError) {
      next(error);
    } else {
      console.error("Error in updateBook function:", error);
      return next(
        createHttpError(500, "Error while processing the book update.")
      );
    }
  }
};

// List Books function
const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fetch all books from the database
    const books = await Book.find(); // Note: In production, use pagination

    // Send the list of books in the response
    return res.json(books);
  } catch (error) {
    console.error("Error while getting the book list:", error);
    return next(createHttpError(500, "Error while getting the book list."));
  }
};

const getSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract the bookId from the request parameters
    const bookId = req.params.bookId;

    // Attempt to find a book with the given ID in the database
    const book = await Book.findOne({ _id: bookId });

    // If no book is found, return a 404 error
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    // If the book is found, return it in the response
    return res.json(book);
  } catch (error) {
    // Log the error to the console
    console.log(error);

    // Return a 500 error if something goes wrong during the process
    return next(createHttpError(500, "Error while getting a book"));
  }
};

export { createBook, updateBook, listBooks, getSingleBook };
