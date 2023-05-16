import { bot } from '../initializeBot';

const groupId = process.env.GROUP_ID as string;

const sendMessageToGroup = async (messageHtml: string) => {
  await bot.sendMessage(groupId, messageHtml, { parse_mode: 'HTML' });
};

export default sendMessageToGroup;
