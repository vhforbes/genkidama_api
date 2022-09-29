import "reflect-metadata";

import { DataSource } from "typeorm";
import { postsTable1664455607246 } from "./migrations/1664455607246-postsTable";
import Post from "./models/Post";
// import { test1664240573713 } from "./migration/1664240573713-test";
// import Appointment from "./models/Appointment";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "docker",
  database: "genkidama",
  synchronize: true,
  logging: false,
  entities: [Post],
  migrations: [postsTable1664455607246],
  subscribers: [],
});
