/* eslint-disable @typescript-eslint/naming-convention */
import { bot } from '../initializeBot';

const groupId = process.env.GROUP_ID as string;

export const alertLiveStart = async () => {
  const liveUrl = `www.genkidama.me/live`;

  const messageHtml = `
<b>ATENÇÃO A LIVE IRÁ COMEÇAR</b> <a href="${liveUrl}">ACESSE AGORA!</a>
Lembre-se de desligar o microfone quando não estiver falando!
`;

  await bot.sendMessage(groupId, messageHtml, { parse_mode: 'HTML' });
};
