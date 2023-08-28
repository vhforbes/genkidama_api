/* eslint-disable @typescript-eslint/naming-convention */
import TelegramBot from 'node-telegram-bot-api';
import { Conversation } from '../helpers';
import { clearConversation } from '../initializeBot';
import UsersRepository from '../../repositories/UsersRepository';

const runAlarmesScene = (
  conversation: Conversation,
  msg: TelegramBot.Message,
  bot: TelegramBot,
) => {
  const telegramId = msg.from?.id;
  const chatId = conversation.chatId;

  const checkAlarmStatus = async () => {
    const user = await UsersRepository.findOne({ where: { telegramId } });

    if (user?.sendAlarms) {
      bot.sendMessage(chatId, 'Seus alarmes estão ativados');
    } else {
      bot.sendMessage(chatId, 'Seus alarmes estão desativados');
    }
  };

  const activateAlarms = async () => {
    const user = await UsersRepository.findOne({ where: { telegramId } });

    if (user?.sendAlarms) {
      bot.sendMessage(chatId, 'Seus alarmes já estão ativados');
      clearConversation(chatId);
      return;
    }

    if (!user) {
      bot.sendMessage(chatId, 'Usuário não encontrado, falar com @vhforbes');
      return;
    }

    user.sendAlarms = true;

    await UsersRepository.save(user);

    bot.sendMessage(chatId, 'Seus alarmes foram ativados');

    clearConversation(chatId);
  };

  const disableAlarms = async () => {
    const user = await UsersRepository.findOne({ where: { telegramId } });

    if (!user?.sendAlarms) {
      bot.sendMessage(chatId, 'Seus alarmes já estão desativados');
      clearConversation(chatId);
      return;
    }

    if (!user) {
      bot.sendMessage(chatId, 'Usuário não encontrado, falar com @vhforbes');
      return;
    }

    user.sendAlarms = false;

    await UsersRepository.save(user);

    bot.sendMessage(chatId, 'Seus alarmes foram desativados');
    clearConversation(chatId);
  };

  switch (msg.text) {
    case '/status':
      checkAlarmStatus();
      break;

    case '/ativar':
      activateAlarms();
      break;

    case '/desativar':
      disableAlarms();
      break;

    default:
      break;
  }
};

export default runAlarmesScene;
