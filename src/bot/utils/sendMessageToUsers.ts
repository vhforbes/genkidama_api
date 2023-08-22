import AppError from '../../errors/AppError';
import User from '../../models/User';
import { bot } from '../initializeBot';

interface Request {
  users: User[];
  messageHtml: string;
}

const sendMessageToUsers = async ({ users, messageHtml }: Request) => {
  users.forEach(async (user: User) => {
    if (!user) {
      throw new AppError(`Could not find user to send message`);
    }

    if (!user.telegramId) {
      throw new AppError(`${user.email} without telegramID`);
    }

    try {
      await bot.sendMessage(user.telegramId, messageHtml, {
        parse_mode: 'HTML',
      });
    } catch (err) {
      console.error(err);
      throw new AppError(`Cloud not send message to ${user.email}`);
    }
  });
};

export default sendMessageToUsers;
