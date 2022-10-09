import { Router } from "express";
import CreateSessionService from "../services/CreateSessionService";

const sessionsRouter = Router();

sessionsRouter.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const createSessionService = new CreateSessionService();

    const { user, token } = await createSessionService.execute({
      email,
      password,
    });

    // @ts-expect-error
    delete user.password;

    return res.json({ user, token });
  } catch (err) {
    if (err instanceof Error) {
      return res.status(400).json({ error: err.message });
    }
  }
});

export default sessionsRouter;
