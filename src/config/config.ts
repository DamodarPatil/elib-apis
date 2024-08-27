import { config as loadEnv } from "dotenv";

loadEnv();

export const config = Object.freeze({
  port: process.env.PORT,
  databaseUrl: process.env.MONGO_CONNECTION_STRING,
  env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
});
