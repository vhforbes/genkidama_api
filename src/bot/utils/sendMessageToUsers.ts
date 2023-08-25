import User from '../../models/User';
import { bot } from '../initializeBot';

interface Request {
  users: User[];
  messageHtml: string;
}

const sendMessageToUsers = async ({ users, messageHtml }: Request) => {
  users.forEach(async (user: User) => {
    if (user?.telegramId) {
      try {
        await bot.sendMessage(user.telegramId, messageHtml, {
          parse_mode: 'HTML',
        });
      } catch (err) {
        console.error(`Cloud not send message to ${user.email}`);
      }
    }
  });
};

export default sendMessageToUsers;
