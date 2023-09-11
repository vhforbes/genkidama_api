/* eslint-disable no-restricted-syntax */
import User from '../../models/User';
import { bot } from '../initializeBot';

interface Request {
  users: User[];
  ticker: string;
  message: string;
  bitgetLink: string;
  bybitLink: string;
}

const sendAlarmToUsers = async ({
  users,
  message,
  ticker,
  bitgetLink,
  bybitLink,
}: Request) => {
  const messageBitget = `Alarme disparado!
    ${ticker}USDT
    ${message}
    <a href="${bitgetLink}">Acessar ${ticker}USDT na Bitget</a>
    `;

  const messageBybit = `Alarme disparado!
    ${ticker}USDT
    ${message}
    <a href="${bybitLink}">Acessar ${ticker}USDT na Bybit</a>
    `;

  users.forEach(async user => {
    if (user?.telegramId) {
      try {
        if (user.exchange === 'BITGET' || !user.exchange)
          await bot.sendMessage(user.telegramId, messageBitget, {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
          });

        if (user.exchange === 'BYBIT')
          await bot.sendMessage(user.telegramId, messageBybit, {
            parse_mode: 'HTML',
            disable_web_page_preview: true,
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

export default sendAlarmToUsers;
