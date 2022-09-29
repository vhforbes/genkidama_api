import { Router } from "express";
import postRouter from "./postsRouter";
import userRouter from "./userRouter";

const routes = Router();

routes.use("/user", userRouter);
routes.use("/post", postRouter);

export default routes;
