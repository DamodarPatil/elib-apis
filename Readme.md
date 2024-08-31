<h1 align="center">📚 Book Management Backend 📚</h1>
<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v14%2B-green" alt="Node.js Version">
  <img src="https://img.shields.io/badge/Express.js-4.x-blue" alt="Express.js Version">
  <img src="https://img.shields.io/badge/MongoDB-v4%2B-green" alt="MongoDB Version">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
</p>


---

A RESTful API for managing books and users, built with Node.js, Express, and MongoDB. The API supports user registration, authentication, and book CRUD operations with role-based access.

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud-based)
- Cloudinary account (for image and book uploads)

## 🚀 Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/DamodarPatil/elib-apis.git
   cd elib-apis

   ```

2. **Install dependencies:**

   ```bash
   npm install

   ```

3. **Set environment variables:**
   Create a `.env` file in the root directory and add the following environment variables:

   ```bash
   PORT=3000
   MONGO_CONNECTION_STRING=your_mongo_connection_string
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   FRONTEND_DOMAIN=your_frontend_domain
   ```

   Replace `your_mongo_connection_string`, `your_jwt_secret`, `your_cloudinary_cloud_name`, `your_cloudinary_api_key`, `your_cloudinary_api_secret`, and `your_frontend_domain` with your own values.

4. **Start the server:**

   ```bash
   npm start

   ```

   The server will start on port 3000 by default, or you can specify a custom port using the `PORT` environment variable.

## 📦 Usage

### API Endpoints

#### User Routes

- `POST /api/users/register`: Register a new user.
- `POST /api/users/login`: Login a user.

#### Book Routes

- `POST /api/books`: Create a new book (requires authentication).
- `PATCH /api/books/:bookId`: Update an existing book (requires authentication).
- `GET /api/books`: List all books.
- `GET /api/books/:bookId`: Get details of a single book by its ID.
- `DELETE /api/books/:bookId`: Delete a book (requires authentication).

### ⚙️ Environment Variables

- `PORT`: The port on which the server will run.
- `MONGO_CONNECTION_STRING`: The connection string for MongoDB.
- `NODE_ENV`: The environment mode (e.g., development, production).
- `JWT_SECRET`: The secret key for JWT authentication.
- `CLOUDINARY_CLOUD_NAME`: The Cloudinary cloud name.
- `CLOUDINARY_API_KEY`: The Cloudinary API key.
- `CLOUDINARY_API_SECRET`: The Cloudinary API secret.
- `FRONTEND_DOMAIN`: The domain of the frontend application.

### 🛠️ Scripts

- `npm run dev`: Start the development server with nodemon.

### 📚 Dependencies

- `bcrypt`: For hashing passwords.
- `cloudinary`: For handling file uploads.
- `cors`: For enabling Cross-Origin Resource Sharing.
- `dotenv`: For loading environment variables.
- `express`: For building the server.
- `http-errors`: For creating HTTP errors.
- `jsonwebtoken`: For handling JWT authentication.
- `mongoose`: For interacting with MongoDB.
- `multer`: For handling file uploads.

## 📝 License

This project is licensed under the MIT License.
