import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

import UsersRepository from '../repositories/UsersRepository';
import { IsNull, Not } from 'typeorm';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAutenticated } from '../middlewares/ensureAuthenticated';

import sendMessageToUsers from '../bot/utils/sendMessageToUsers';
import sendMessageToGroup from '../bot/utils/sendMessageToGroup';

// import storageConfig from '../config/multer';
// import { bot } from '../bot/initializeBot';

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

// const upload = multer({ storage: storageConfig });

// mestreKameRouter.post(
//   '/broadcastImage',
//   ensureAutenticated,
//   ensureAdmin,
//   upload.single('image'),
//   async (req, res) => {
//     // if (req.file) {
//     //   bot
//     //     .sendPhoto(
//     //       -817116434,
//     //       fs.createReadStream(
//     //         path.join(__dirname, 'uploads', req.file.filename),
//     //       ),
//     //     )
//     //     .then(() => {
//     //       if (req.file)
//     //         fs.unlinkSync(path.join(__dirname, 'uploads', req.file.filename)); // Delete file after sending
//     //       res.send('Image uploaded and sent via Telegram.');
//     //     })
//     //     .catch(err => {
//     //       console.error(err);
//     //       res.status(500).send('Failed to send image via Telegram.');
//     //     });
//     // } else {
//     //   res.status(400).send('No file uploaded.');
//     // }

//     res.send('ok');
//   },
// );

export default mestreKameRouter;
