import TelegramBot from 'node-telegram-bot-api';
import BanFromTelegramGroupService from '../services/Telegram/BanFromTelegramGroupService';
import {
  newConversationsList,
  Conversation,
  findCurrentConversation,
  updateConversationsList,
  MemberScene,
} from './helpers';
import runMemberScene from './runMemberScene';

const botToken = process.env.BOT_TOKEN as string;

export const groupId = -817116434;

export const bot = new TelegramBot(botToken, { polling: true });

const allCommands = ['/membro', '/ajuda', '/sair', '/ban'];

// Salvar no banco e fazer um request em algum momento?
let activeConversations: Array<Conversation> = [];

export const clearConversation = (chatId: number) => {
  for (let i = 0; i < activeConversations.length; i += 1) {
    const conversation = activeConversations[i];
    if (conversation.chatId === chatId) {
      conversation.currentScene = null;
    }
  }
};

export const startBot = async () => {
  // Todas mensagens de texto que o bot recebe, serão processadas aqui de acordo com a conversa atual
  bot.on('message', msg => {
    const chatId = msg.chat.id;
    let conversation = findCurrentConversation(chatId, activeConversations);

    // Ignore massages from group
    if (chatId === groupId) return;

    // Checks if is a known command
    for (let i = 0; i < allCommands.length; i += 1) {
      if (allCommands[i] === msg.text) {
        return;
      }
    }

    switch (conversation?.currentScene?.command) {
      case '/membro':
        runMemberScene(conversation, msg, bot);
        break;

      case '/ajuda':
        break;

      default:
        break;
    }

    if (!conversation) {
      activeConversations = newConversationsList(
        chatId,
        activeConversations,
        null,
      );

      bot.sendMessage(
        chatId,
        'Vi que você é novo por aqui! Seja bem-vindo!!! \nDigite /ajuda para saber os comandos disponíveis',
      );

      return;
    }

    if (!conversation.currentScene) {
      bot.sendMessage(
        chatId,
        'Não entendi, digite /ajuda para saber os comandos disponíveis',
      );
    }
  });

  // Start "/membro" scene
  bot.onText(/\/membro/, msg => {
    const chatId = msg.chat.id;

    let conversation = findCurrentConversation(chatId, activeConversations);

    const memberScene: MemberScene = {
      command: '/membro',
      currentStep: 'AWAIT_EMAIL',
    };

    if (conversation) {
      conversation.currentScene = memberScene;

      activeConversations = updateConversationsList(
        chatId,
        conversation,
        activeConversations,
      );
    }

    if (!conversation) {
      activeConversations = newConversationsList(
        chatId,
        activeConversations,
        memberScene,
      );
    }

    bot.sendMessage(
      chatId,
      'Envie seu email que vamos validar e te enviar o link',
    );
  });

  // Trigger "/ajuda" scene
  bot.onText(/\/ajuda/, msg => {
    const chatId = msg.chat.id;

    bot.sendMessage(
      chatId,
      '<b>Comandos Disponíveis:</b> \n /membro => Entrar no grupo',
      {
        parse_mode: 'HTML',
      },
    );
  });

  bot.onText(/\/sair/, msg => {
    clearConversation(msg.chat.id);
  });

  bot.onText(/\/ban/, async msg => {
    // @ts-expect-error
    const chatMembersNumber = await bot.getChatMemberCount(groupId);

    const response = await BanFromTelegramGroupService.execute({
      chatMembersNumber,
    });

    if (!response) {
      bot.sendMessage(msg.chat.id, 'A lista está atualizada');
      return;
    }

    response.forEach(memberToBan => {
      bot.banChatMember(groupId, `${memberToBan}`);
      bot.sendMessage(msg.chat.id, `Banned user: ${memberToBan}`);
    });
  });
};
