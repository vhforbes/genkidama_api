import { Router } from 'express';
import sendMessageToUsers from '../bot/utils/sendMessageToUsers';
import UsersRepository from '../repositories/UsersRepository';
import { IsNull, Not } from 'typeorm';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAutenticated } from '../middlewares/ensureAuthenticated';
import sendMessageToGroup from '../bot/utils/sendMessageToGroup';

const mestreKameRouter = Router();

mestreKameRouter.post(
  '/broadcastToGroup',
  ensureAutenticated,
  ensureAdmin,
  async (req, res) => {
    const { message } = req.body;

    await sendMessageToGroup(message);

    return res.json('message sent');
  },
);

mestreKameRouter.post(
  '/broadcastToUsers',
  ensureAutenticated,
  ensureAdmin,
  async (req, res) => {
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

    return res.status(200).send('OK');
  },
);

export default mestreKameRouter;
