/* eslint-disable @typescript-eslint/naming-convention */
import TelegramBot from 'node-telegram-bot-api';
import AddTelegramGroupService from '../../services/Telegram/AddTelegramGroupService';
import { Conversation } from '../helpers';
import { clearConversation } from '../initializeBot';
import { rules } from '../html/rules';

const groupId = process.env.GROUP_ID as string;

const runMemberScene = (
  conversation: Conversation,
  msg: TelegramBot.Message,
  bot: TelegramBot,
) => {
  const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const chatId = conversation.chatId;

  const revokeLink = (invite_link: string) => {
    bot.revokeChatInviteLink(-817116434, invite_link);
  };

  const addToGroup = async () => {
    const validMail = mailformat.test(msg.text as string);

    if (!validMail) {
      bot.sendMessage(chatId, 'Email inválido');
      return;
    }

    const email = msg.text?.toLowerCase() as string;

    try {
      const response = await AddTelegramGroupService.execute({
        email,
        telegramUserId: msg.from?.id as number,
      });

      if (!response.success) {
        bot.sendMessage(chatId, response.messageForBot);
        clearConversation(chatId);
        return;
      }

      bot.sendMessage(msg.chat.id, rules);

      const { invite_link } = await bot.createChatInviteLink(groupId);

      bot.sendMessage(
        chatId,
        'Seja bem vindo, basta clicar no link abaixo para entrar!',
      );
      bot.sendMessage(msg.chat.id, invite_link);

      // COLOCAR UM CASE DE ACORDO COM A RESPONSE DO SERVER MANDAR UMA MSG DIFERENTE
      // O ERRO SOMENTE PARA FALHA NA REQUISICAO

      clearConversation(chatId);

      setTimeout(() => revokeLink(invite_link), 100000);
    } catch (err) {
      console.error(err);
    }
  };

  // MANAGE STEPS
  switch (conversation.currentScene?.currentStep) {
    case 'AWAIT_EMAIL':
      addToGroup();
      break;

    default:
      break;
  }
};

export default runMemberScene;
