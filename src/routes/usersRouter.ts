import { Router } from "express";
import CreateUserService from "../services/CreateUserService";

const usersRouter = Router();

usersRouter.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const createUserService = new CreateUserService();

    const user = await createUserService.execute({
      name,
      email,
      password,
    });

    // @ts-expect-error
    delete user.password;

    return res.json(user);
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({ error: err.message });
    }
  }
});

export default usersRouter;
