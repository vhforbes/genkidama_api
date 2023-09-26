import TelegramBot from 'node-telegram-bot-api';
import BanFromTelegramGroupService from '../services/Telegram/BanFromTelegramGroupService';
import {
  newConversationsList,
  Conversation,
  findCurrentConversation,
  updateConversationsList,
  MemberScene,
  AlarmesScene,
} from './helpers';
import runMemberScene from './scenes/runMemberScene';
import { rules } from './html/rules';
import runAlarmesScene from './scenes/runAlarmesScene';

// char id caio 1171976785

const botToken = process.env.BOT_TOKEN as string;

export const groupId = parseInt(process.env.GROUP_ID as string, 10);

// export const groupId = process.env.GROUP_ID as string;

export const bot = new TelegramBot(botToken, { polling: true });

const allCommands = [
  '/membro',
  '/ajuda',
  '/sair',
  '/ban',
  '/regras',
  '/alarmes',
];

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

      case '/alarmes':
        runAlarmesScene(conversation, msg, bot);
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
        `
Comandos Disponíveis:
/membro => Entrar no grupo
/alarmes => Ativar ou desativar alarmes
`,
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
      `
<b>Comandos Disponíveis:</b>
/membro => Entrar no grupo
/alarmes => Ativar ou desativar
`,
      {
        parse_mode: 'HTML',
      },
    );
  });

  bot.onText(/\/sair/, msg => {
    clearConversation(msg.chat.id);
  });

  bot.onText(/\/ban/, async msg => {
    const chatId = msg.chat.id;

    if (chatId === groupId) return;

    const response = await BanFromTelegramGroupService.execute();

    if (response?.length === 0) {
      bot.sendMessage(msg.chat.id, 'A lista está atualizada');
      return;
    }

    response.forEach(memberToBan => {
      bot.banChatMember(groupId, `${memberToBan}`);
      bot.sendMessage(msg.chat.id, `Banned user: ${memberToBan}`);
    });
  });

  bot.onText(/\/regras/, msg => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, rules, {
      parse_mode: 'HTML',
    });
  });

  // Start "/alarmes" scene
  bot.onText(/\/alarmes/, msg => {
    const chatId = msg.chat.id;

    let conversation = findCurrentConversation(chatId, activeConversations);

    const alarmesScene: AlarmesScene = {
      command: '/alarmes',
      currentStep: 'AWAIT_ALERTAS_COMMAND',
    };

    if (conversation) {
      conversation.currentScene = alarmesScene;

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
        alarmesScene,
      );
    }

    const alarmsMessage = `
Bem vindo ao gerenciador de alarmes.
Digite /status pra saber o status de alarmes da sua conta.
/ativar para ativar ou /desativar para desativar`;

    bot.sendMessage(chatId, alarmsMessage);
  });
};

export const stopBot = async () => {
  await bot.stopPolling({
    cancel: true,
  });
};
