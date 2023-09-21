/* eslint-disable no-restricted-syntax */
import UsersRepository from '../../repositories/UsersRepository';
import { bot } from '../initializeBot';

interface Request {
  messageHtml: string;
}

const sendMessageToAdmins = async ({ messageHtml }: Request) => {
  const admins = await UsersRepository.adminsList();

  admins.forEach(async user => {
    if (user?.telegramId) {
      try {
        await bot.sendMessage(user.telegramId, messageHtml, {
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        });
      } catch (err: any) {
        // Log the error but do nothing else.
        console.error(
          `Could not send message to ADMIN ${user.email} due to an error: ${err}`,
        );
      }
    }
  });
};

export default sendMessageToAdmins;
