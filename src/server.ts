import "reflect-metadata";

import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import routes from "./routes";
import { AppDataSource } from "./data-source";
import uploadConfig from "./config/upload";
import AppError from "./errors/AppError";

AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

const app = express();

app.use(express.json());

app.use("/files", express.static(uploadConfig.tmpPath));
app.use(routes);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  console.error(err);

  res.status(500).json({
    status: "error",
    message: err.message,
  });
});

app.listen(3333, () => {
  console.log("Server started on port 3333");
});
