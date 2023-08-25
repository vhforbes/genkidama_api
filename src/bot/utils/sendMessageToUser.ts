import User from '../../models/User';
import { bot } from '../initializeBot';

interface Request {
  user: User;
  messageHtml: string;
}

const sendMessageToUser = async ({ user, messageHtml }: Request) => {
  if (user?.telegramId) {
    try {
      await bot.sendMessage(user.telegramId, messageHtml, {
        parse_mode: 'HTML',
      });
    } catch (err) {
      console.error(`Cloud not send message to ${user.email}`);
    }
  }
};

export default sendMessageToUser;
