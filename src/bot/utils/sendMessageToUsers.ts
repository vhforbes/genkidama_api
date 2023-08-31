/* eslint-disable no-restricted-syntax */
import User from '../../models/User';
import { bot } from '../initializeBot';

interface Request {
  users: User[];
  messageHtml: string;
}

const sendMessageToUsers = async ({ users, messageHtml }: Request) => {
  users.forEach(async user => {
    if (user?.telegramId) {
      try {
        await bot.sendMessage(user.telegramId, messageHtml, {
          parse_mode: 'HTML',
        });
      } catch (err: any) {
        // Log the error but do nothing else.
        if (err.code === 'ETELEGRAM') {
          console.error(
            `Could not send message to ${user.email} because the bot was blocked by the user`,
          );
        } else {
          console.error(
            `Could not send message to ${user.email} due to an unknown error: ${err}`,
          );
        }
      }
    }
  });
};

export default sendMessageToUsers;
