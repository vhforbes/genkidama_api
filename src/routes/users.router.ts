import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';

import { ensureAutenticated } from '../middlewares/ensureAuthenticated';
import CreateUserService from '../services/Users/CreateUserService';
import UpdateUserAvatarService from '../services/Users/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  const user = await CreateUserService.execute({
    name,
    email,
    password,
  });

  // @ts-expect-error
  delete user.password;

  return res.json(user);
});

// colocar middleware de validacao de sessao
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

    delete user.password;

    res.json(user);
  },
);

export default usersRouter;
