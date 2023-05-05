/* eslint-disable @typescript-eslint/naming-convention */
import { AppDataSource } from '../../data-source';
import { roles } from '../../enums/roles';
import User from '../../models/User';
import UsersRepository from '../../repositories/UsersRepository';
import { bot } from '../initializeBot';
import sendMessageToUsers from '../utils/sendMessageToUsers';

const groupId = process.env.GROUP_ID as string;

export const alertLiveStart = async () => {
  const liveUrl = `www.genkidama.me/live`;

  const userRepository = AppDataSource.getRepository(User);

  const users = await userRepository.find({ relations: ['subscription'] });

  const messageHtml = `
<b>ATENÇÃO A LIVE IRÁ COMEÇAR</b> <a href="${liveUrl}">ACESSE AGORA!</a>
Lembre-se de desligar o microfone quando não estiver falando!
`;

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

  await bot.sendMessage(groupId, messageHtml, { parse_mode: 'HTML' });
};

export const alertLiveClose = async () => {
  const users = await UsersRepository.memberList();

  const messageHtml = `
<b> --- LIVE ENCERRADA --- </b>
OBRIGADO PELA PARTICIPAÇÃO
`;

  await sendMessageToUsers({ users, messageHtml });

  await bot.sendMessage(groupId, messageHtml, { parse_mode: 'HTML' });
};
