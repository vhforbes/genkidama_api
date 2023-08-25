import { bot } from '../initializeBot';

const groupId = process.env.GROUP_ID as string;

const sendMessageToGroup = async (messageHtml: string) => {
  try {
    await bot.sendMessage(groupId, messageHtml, { parse_mode: 'HTML' });
  } catch (error) {
    console.error('Cloud not send message to group');
    console.error(error);
  }
};

export default sendMessageToGroup;
