/* eslint-disable @typescript-eslint/naming-convention */
import TradeOperation from '../../models/TradeOperation';
import { bot } from '../initializeBot';

export const followingSucessfully = async (
  tradeOperation: TradeOperation,
  userId: number,
) => {
  const {
    id,
    market,
    direction,
    status,
    // observation = '',
  } = tradeOperation;

  const operationUrl = `www.genkidama.me/operations/${id}`;

  const messageHtml = `
<b>VOCÊ ESTÁ SEGUINDO A OPERAÇÃO</b>: 
<b>${market}</b> | ${direction} | ${status}
${`<a href="${operationUrl}">Acessar operação</a>`}
`;

  await bot.sendMessage(userId, messageHtml, { parse_mode: 'HTML' });
};
