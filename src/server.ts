import "reflect-metadata";

import express from "express";
import routes from "./routes";
import { AppDataSource } from "./data-source";

AppDataSource.initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

const app = express();

app.use(express.json());
app.use(routes);

app.listen(3333, () => {
  console.log("Server started on port 3333");
});
