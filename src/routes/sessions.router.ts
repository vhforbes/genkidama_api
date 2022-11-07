import { Router } from 'express';
import AppError from '../errors/AppError';
import { ensureAutenticated } from '../middlewares/ensureAuthenticated';
import CreateSessionService from '../services/Sessions/CreateSessionService';
import RefreshTokenService from '../services/Sessions/RefreshTokenService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (req, res) => {
  const { email, password } = req.body;

  const { user, token, refreshToken } = await CreateSessionService.execute({
    email,
    password,
  });

  // @ts-expect-error
  delete user.password;

  return res.json({ user, token, refreshToken });
});

sessionsRouter.get('/', ensureAutenticated, async (req, res) => {
  return res.json({ validSession: true });
});

sessionsRouter.post('/refresh', async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    throw new AppError('RefreshToken is missing');
  }

  const newToken = await RefreshTokenService.execute({ refreshToken });

  return res.json(newToken);
});

export default sessionsRouter;
