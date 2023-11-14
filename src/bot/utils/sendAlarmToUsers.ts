/* eslint-disable no-restricted-syntax */
import User from '../../models/User';
import { bot } from '../initializeBot';

interface Request {
  users: User[];
  ticker: string;
  message: string;
  price: string;
  bitgetLink: string;
  bybitLink: string;
}

const sendAlarmToUsers = async ({
  users,
  message,
  ticker,
  price,
  bitgetLink,
  bybitLink,
}: Request) => {
  const messageBitget = `Alarme disparado!
    ${ticker}USDT - $${price}
    ${message}
    <a href="${bitgetLink}">Acessar ${ticker}USDT na Bitget</a>
    `;

  const messageBybit = `Alarme disparado!
    ${ticker}USDT- $${price}
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
        console.error(
          `Could not send message to ${user.email} due to an error: ${err}`,
        );
      }
    }
  });
};

export default sendAlarmToUsers;
