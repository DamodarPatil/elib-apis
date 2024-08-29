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
    res.status(201).json({
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
      next(createHttpError(500, "Error while processing the book creation."));
    }
  }
};

export { createBook };

// import path from "node:path";
// import fs from "node:fs";
// import { NextFunction, Request, Response } from "express";
// import cloudinary from "../config/cloudinary";
// import createHttpError from "http-errors";
// import { Book } from "./bookModel";
// import { AuthRequest } from "../middleware/authenticate";

// const createBook = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { title, genre } = req.body;

//     const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//     const coverImageMimeType = files.coverImage[0].mimetype.split("/").at(-1);
//     const fileName = files.coverImage[0].filename;
//     const filePath = path.resolve(
//       __dirname,
//       "../../public/data/uploads",
//       fileName
//     );

//     const uploadResult = await cloudinary.uploader.upload(filePath, {
//       filename_override: fileName,
//       folder: "book-covers",
//       format: coverImageMimeType,
//     });

//     const bookFileName = files.file[0].filename;
//     const bookFilePath = path.resolve(
//       __dirname,
//       "../../public/data/uploads",
//       bookFileName
//     );

//     const bookFileUploadResult = await cloudinary.uploader.upload(
//       bookFilePath,
//       {
//         resource_type: "raw",
//         filename_override: bookFileName,
//         folder: "book-PDFs",
//         format: "pdf",
//       }
//     );

//     const newBook = await Book.create({
//       title,
//       genre,
//       author: (req as AuthRequest).userId,
//       coverImage: uploadResult.secure_url,
//       file: bookFileUploadResult.secure_url,
//     });

//     // delete temp files
//     await fs.promises.unlink(filePath);
//     await fs.promises.unlink(bookFilePath);

//     res.status(201).json({
//       id: newBook._id,
//       message: "",
//     });
//   } catch (error) {
//     return next(createHttpError(500, "Error while uploading the files."));
//   }
// };

// export { createBook };
