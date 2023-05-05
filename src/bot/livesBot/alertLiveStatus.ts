/* eslint-disable @typescript-eslint/naming-convention */
import { AppDataSource } from '../../data-source';
import User from '../../models/User';
import { bot } from '../initializeBot';

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
    if (!user.telegramId) {
      console.error(
        `Cant send live alert to ${user.email} without telegram id`,
      );
      return;
    }

    await bot.sendMessage(user.telegramId, messageHtml, { parse_mode: 'HTML' });
  });

  await bot.sendMessage(groupId, messageHtml, { parse_mode: 'HTML' });
};

export const alertLiveClose = async () => {
  const userRepository = AppDataSource.getRepository(User);

  const users = await userRepository.find({ relations: ['subscription'] });

  const messageHtml = `
<b>--- LIVE ENCERRADA ---b>
OBRIGADO PELA PARTICIPAÇÃO
`;

  users.forEach(async (user: User) => {
    if (!user.telegramId) {
      console.error(
        `Cant send live alert to ${user.email} without telegram id`,
      );
      return;
    }

    await bot.sendMessage(user.telegramId, messageHtml, { parse_mode: 'HTML' });
  });

  await bot.sendMessage(groupId, messageHtml, { parse_mode: 'HTML' });
};
