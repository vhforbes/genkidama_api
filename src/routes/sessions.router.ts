import { Router } from 'express';
import CreateSessionService from '../services/CreateSessionService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await CreateSessionService.execute({
    email,
    password,
  });

  // @ts-expect-error
  delete user.password;

  return res.json({ user, token });
});

export default sessionsRouter;
