import express from "express";

const app = express();

app.get("/", (request, response, next) => {
  response.json({
    message: "Welcome",
  });
});

export default app;
