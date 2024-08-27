import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to the database successfully");
    });

    mongoose.connection.on("error", (error) => {
      console.error("Error in connecting to the database", error);
    });

    await mongoose.connect(config.databaseUrl as string);
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1); 
  }
};

export default connectDB;
