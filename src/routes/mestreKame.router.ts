import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';

import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAutenticated } from '../middlewares/ensureAuthenticated';

import sendMessageToGroup from '../bot/utils/sendMessageToGroup';
import BroadcastImageToGroupService from '../services/MestreKame/broadcastImageToGroupService';
import BroadcastImageToMembersService from '../services/MestreKame/broadcastImageToMembersService';
import sendMessageToUsers from '../bot/utils/sendMessageToUsers';
import UsersRepository from '../repositories/UsersRepository';
import { IsNull, Not } from 'typeorm';

// import storageConfig from '../config/multer';
// import { bot } from '../bot/initializeBot';

const mestreKameRouter = Router();
const upload = multer(uploadConfig);

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
  '/broadcastToMembers',
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

mestreKameRouter.post(
  '/broadcastImageToGroup',
  ensureAutenticated,
  ensureAdmin,
  upload.single('image'),
  async (req, res) => {
    const file = req.file;

    if (!file) {
      throw new Error('You must upload a file');
    }

    BroadcastImageToGroupService.execute({ fileName: file.filename });

    res.json({ status: 'ok' });
  },
);

mestreKameRouter.post(
  '/broadcastImageToMembers',
  ensureAutenticated,
  ensureAdmin,
  upload.single('image'),
  async (req, res) => {
    const file = req.file;

    if (!file) {
      throw new Error('You must upload a file');
    }

    BroadcastImageToMembersService.execute({ fileName: file.filename });

    res.json({ status: 'ok' });
  },
);

export default mestreKameRouter;
