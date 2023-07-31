import AppError from '../../errors/AppError';
import User from '../../models/User';
import { bot } from '../initializeBot';

interface Request {
  user: User;
  messageHtml: string;
}

const sendMessageToUser = async ({ user, messageHtml }: Request) => {
  if (!user.telegramId) {
    throw new AppError(`${user.email} without telegramID`);
  }

  if (user.telegramId) {
    try {
      await bot.sendMessage(user.telegramId, messageHtml, {
        parse_mode: 'HTML',
      });
    } catch (err) {
      throw new AppError(`Cloud not send message to ${user.email}`);
    }
  }
};

export default sendMessageToUser;
