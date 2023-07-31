import { Router } from 'express';
import dotenv from 'dotenv';
import multer from 'multer';

import uploadConfig from '../config/upload';
import { AppDataSource } from '../data-source';

import { ensureAutenticated } from '../middlewares/ensureAuthenticated';
import User from '../models/User';

import CreateUserService from '../services/Users/CreateUserService';
import RecoverPasswordService from '../services/Users/RecoverPasswordService';
import SendPasswordResetLinkSerivce from '../services/Users/SendPasswordResetLinkSerivce';
import UpdateUserAvatarService from '../services/Users/UpdateUserAvatarService';
import UpdateUserService from '../services/Users/UpdateUserService';
import VerifyEmailSerice from '../services/Users/VerifyEmailSerice';
import AppError from '../errors/AppError';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import SetUserMemberService from '../services/Users/SetUserMemberService';
import ListUsersService from '../services/Users/ListUsersService';
import UsersRepository from '../repositories/UsersRepository';

const usersRouter = Router();
const upload = multer(uploadConfig);
dotenv.config();

usersRouter.get('/', ensureAutenticated, async (req, res) => {
  const userId = req.user.id;

  const userRepository = AppDataSource.getRepository(User);

  if (!userId) {
    throw new AppError('No user ID provided');
  }

  const user = await userRepository.findOne({
    where: {
      id: userId,
    },
    relations: { subscription: true, tradeOperations: true },
  });

  // @ts-expect-error
  delete user.password;

  return res.json({ user });
});

usersRouter.get(
  '/id/:id',
  ensureAutenticated,
  ensureAdmin,
  async (req, res) => {
    const usersRepository = UsersRepository;

    const { id } = req.params;

    const user = await usersRepository.findOne({
      where: {
        id,
      },
      relations: ['subscription'],
    });

    if (!user) {
      throw new AppError('Could not find user');
    }

    return res.json(user);
  },
);

usersRouter.get('/list', ensureAutenticated, ensureAdmin, async (req, res) => {
  const usersList = await ListUsersService.execute();

  return res.json(usersList);
});

usersRouter.post('/', async (req, res) => {
  const { name, email, password, bitgetUID } = req.body;

  const { user } = await CreateUserService.execute({
    name,
    email,
    password,
    bitgetUID,
  });

  // @ts-expect-error
  delete user.password;

  return res.json({ user });
});

usersRouter.patch(
  '/avatar',
  ensureAutenticated,
  upload.single('avatar'),
  async (req, res) => {
    const file = req.file;

    if (!file) {
      throw new Error('You must upload a file');
    }

    const user = await UpdateUserAvatarService.execute({
      user_id: req.user.id,
      avatar: file.filename,
    });

    // @ts-expect-error
    delete user.password;

    res.json(user);
  },
);

usersRouter.patch(
  '/set-member',
  ensureAutenticated,
  ensureAdmin,
  async (req, res) => {
    const { email, isMember } = req.body;

    const user = await SetUserMemberService.execute({
      email,
      isMember,
    });

    res.json(user);
  },
);

usersRouter.put(
  '/update/:id',
  ensureAutenticated,
  ensureAdmin,
  async (req, res) => {
    const updatedUser = await UpdateUserService.execute(req.body as User);

    res.send(updatedUser);
  },
);

usersRouter.put('/updateFromToken', ensureAutenticated, async (req, res) => {
  const { name, bitgetUID } = req.body;

  const updatedUser = await UpdateUserService.execute({
    id: req.user.id,
    name,
    bitgetUID,
  } as User);

  res.send(updatedUser);
});

usersRouter.get('/verify/:token', async (req, res) => {
  const token = req.params.token;
  const response = await VerifyEmailSerice.execute({ token });

  if (response.success) {
    res.redirect(`${process.env.FRONTEND_URL}/sign-in`);
  }
});

usersRouter.post('/recover', async (req, res) => {
  const email = req.body.email;

  await SendPasswordResetLinkSerivce.execute({ email });

  res.send({ ok: 'ok' });
});

usersRouter.put('/recover', async (req, res) => {
  const token = req.body.token;
  const newPassword = req.body.newPassword;

  const response = await RecoverPasswordService.execute({ token, newPassword });

  // @ts-expect-error
  delete response.user.password;

  res.send(response);
});

export default usersRouter;
