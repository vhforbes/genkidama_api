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
          disable_web_page_preview: true,
        });
      } catch (err: any) {
        // Log the error but do nothing else.
        console.error(
          `Could not send message to ${user.email} due to an error: ${err}`,
        );
      }
    }
  });
};

export default sendMessageToUsers;
