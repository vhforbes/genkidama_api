import { Router } from 'express';
import sendMessageToUsers from '../bot/utils/sendMessageToUsers';
import UsersRepository from '../repositories/UsersRepository';
import { IsNull, Not } from 'typeorm';
import { ensureAdmin } from '../middlewares/ensureAdmin';

const mestreKameRouter = Router();

mestreKameRouter.post('/broadcast', ensureAdmin, async (req, res) => {
  const { message } = req.body;

  const users = await UsersRepository.find({
    where: {
      telegramId: Not(IsNull()),
    },
  });

  await sendMessageToUsers({
    users,
    messageHtml: message as string,
  });

  return res.json('message sent');
});

export default mestreKameRouter;
