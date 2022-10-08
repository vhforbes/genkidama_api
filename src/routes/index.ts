import { Router } from "express";
import postsRouter from "./postsRouter";
import usersRouter from "./usersRouter";

const routes = Router();

routes.use("/users", usersRouter);
routes.use("/posts", postsRouter);

export default routes;
