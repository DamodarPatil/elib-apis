import mongoose from "mongoose";
import { config } from "./config";

const connetDB = async () => {
  try {
    await mongoose.connect(config.databaseUrl as string);

    mongoose.connection.on("connected", () => {
      console.log("Connected to database successfully");
    });
  } catch (error) {
    console.error("Failed to connect to database", error);
  }
};

export default connetDB;
