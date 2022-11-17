import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';

import { ensureAutenticated } from '../middlewares/ensureAuthenticated';

import CreateUserService from '../services/Users/CreateUserService';
import SendVerificationEmailService from '../services/Users/SendVerificationEmailService';
import UpdateUserAvatarService from '../services/Users/UpdateUserAvatarService';
import VerifyEmailSerice from '../services/Users/VerifyEmailSerice';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  const { user, token } = await CreateUserService.execute({
    name,
    email,
    password,
  });

  // @ts-expect-error
  delete user.password;

  // -------- Send verification email --------

  await SendVerificationEmailService.execute({ token });

  return res.json(user);
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

usersRouter.get('/verify/:token', async (req, res) => {
  const token = req.params.token;
  const response = await VerifyEmailSerice.execute({ token });

  if (response.success) {
    res.redirect('http://google.com');
  }
});

export default usersRouter;
