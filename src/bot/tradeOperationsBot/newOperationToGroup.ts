/* eslint-disable @typescript-eslint/naming-convention */
import TradeOperation from '../../models/TradeOperation';
import { bot } from '../initializeBot';

const groupId = process.env.GROUP_ID as string;

export const newOperationToGroup = async (tradeOperation: TradeOperation) => {
  const {
    id,
    market,
    direction,
    status,
    maxFollowers,
    // observation = '',
  } = tradeOperation;

  const operationUrl = `www.genkidama.me/operations/${id}`;

  const messageHtml = `
<b>NOVA OPERAÇÃO</b>: 
<b>${market}</b> | ${direction} | ${status}
${`<b>Máximo de seguidores: ${maxFollowers}</b>\n`}
${`<a href="${operationUrl}">Acessar operação</a>`}
`;

  await bot.sendMessage(groupId, messageHtml, { parse_mode: 'HTML' });
};
