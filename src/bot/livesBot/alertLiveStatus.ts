/* eslint-disable @typescript-eslint/naming-convention */
import UsersRepository from '../../repositories/UsersRepository';
import { bot } from '../initializeBot';
import sendMessageToUsers from '../utils/sendMessageToUsers';

const groupId = process.env.GROUP_ID as string;

export const alertLiveStart = async () => {
  const liveUrl = `www.genkidama.me/live`;

  const users = await UsersRepository.memberList();

  const messageHtml = `
<b>ATENÇÃO A LIVE IRÁ COMEÇAR</b> <a href="${liveUrl}">ACESSE AGORA!</a>
Lembre-se de desligar o microfone quando não estiver falando!
`;

  await sendMessageToUsers({ users, messageHtml });
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
