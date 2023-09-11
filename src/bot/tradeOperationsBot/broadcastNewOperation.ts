/* eslint-disable @typescript-eslint/naming-convention */
import TradeOperation from '../../models/TradeOperation';
import UsersRepository from '../../repositories/UsersRepository';
import { bot } from '../initializeBot';
import sendMessageToUsers from '../utils/sendMessageToUsers';

const groupId = process.env.GROUP_ID as string;

export const broadcastNewOperation = async (tradeOperation: TradeOperation) => {
  const {
    id,
    market,
    // direction,
    // status,
    maxFollowers,
    // observation = '',
  } = tradeOperation;

  const operationUrl = `www.genkidama.me/operations/${id}`;

  const messageHtml = `
<b>NOVA OPERAÇÃO</b>: 
<b>${market}</b>
${`<b>Máximo de seguidores: ${maxFollowers}</b>\n`}
${`<a href="${operationUrl}#seguir">Seguir essa operação!</a>`}
`;

  const users = await UsersRepository.memberList();

  await sendMessageToUsers({ users, messageHtml });

  await bot.sendMessage(groupId, messageHtml, { parse_mode: 'HTML' });
};
