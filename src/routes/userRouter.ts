import { Router } from "express";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.json({ name: "victor" });
});

export default userRouter;
