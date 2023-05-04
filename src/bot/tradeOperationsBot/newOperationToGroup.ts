/* eslint-disable @typescript-eslint/naming-convention */
import { AppDataSource } from '../../data-source';
import { roles } from '../../enums/roles';
import TradeOperation from '../../models/TradeOperation';
import User from '../../models/User';
import { bot } from '../initializeBot';

const groupId = process.env.GROUP_ID as string;

export const newOperationToGroup = async (tradeOperation: TradeOperation) => {
  const userRepository = AppDataSource.getRepository(User);

  const users = await userRepository.find();

  const {
    id,
    market,
    // direction,
    status,
    maxFollowers,
    // observation = '',
  } = tradeOperation;

  const operationUrl = `www.genkidama.me/operations/${id}`;

  const messageHtml = `
<b>NOVA OPERAÇÃO</b>: 
<b>${market}</b> | ${status}
${`<b>Máximo de seguidores: ${maxFollowers}</b>\n`}
${`<a href="${operationUrl}">Acessar operação</a>`}
`;

  await bot.sendMessage(groupId, messageHtml, { parse_mode: 'HTML' });

  // Send for all users with privleges
  users.forEach(async (user: User) => {
    if (
      user.telegramId &&
      (user.subscription?.status === 'ACTIVE' ||
        user.role === roles.member ||
        user.role === roles.admin)
    ) {
      await bot.sendMessage(user.telegramId, messageHtml, {
        parse_mode: 'HTML',
      });
    }
  });
};
