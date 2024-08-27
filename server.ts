import app from "./src/app";
import { config } from "./src/config/config";
import connetDB from "./src/config/db";

const startServer = async () => {
  // Connect Database
  await connetDB();

  const port = config.port || 3000;

  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
};

startServer();
