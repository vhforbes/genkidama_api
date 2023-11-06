"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopBot = exports.startBot = exports.clearConversation = exports.bot = exports.groupId = void 0;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const BanFromTelegramGroupService_1 = __importDefault(require("../services/Telegram/BanFromTelegramGroupService"));
const helpers_1 = require("./helpers");
const runMemberScene_1 = __importDefault(require("./scenes/runMemberScene"));
const rules_1 = require("./html/rules");
const runAlarmesScene_1 = __importDefault(require("./scenes/runAlarmesScene"));
// char id caio 1171976785
const botToken = process.env.BOT_TOKEN;
exports.groupId = parseInt(process.env.GROUP_ID, 10);
// export const groupId = process.env.GROUP_ID as string;
exports.bot = new node_telegram_bot_api_1.default(botToken, { polling: true });
const allCommands = [
    '/membro',
    '/ajuda',
    '/sair',
    '/ban',
    '/regras',
    '/alarmes',
];
// Salvar no banco e fazer um request em algum momento?
let activeConversations = [];
const clearConversation = (chatId) => {
    for (let i = 0; i < activeConversations.length; i += 1) {
        const conversation = activeConversations[i];
        if (conversation.chatId === chatId) {
            conversation.currentScene = null;
        }
    }
};
exports.clearConversation = clearConversation;
const startBot = () => __awaiter(void 0, void 0, void 0, function* () {
    // Todas mensagens de texto que o bot recebe, serão processadas aqui de acordo com a conversa atual
    exports.bot.on('message', msg => {
        var _a;
        const chatId = msg.chat.id;
        let conversation = (0, helpers_1.findCurrentConversation)(chatId, activeConversations);
        // Ignore massages from group
        if (chatId === exports.groupId)
            return;
        // Checks if is a known command
        for (let i = 0; i < allCommands.length; i += 1) {
            if (allCommands[i] === msg.text) {
                return;
            }
        }
        switch ((_a = conversation === null || conversation === void 0 ? void 0 : conversation.currentScene) === null || _a === void 0 ? void 0 : _a.command) {
            case '/membro':
                (0, runMemberScene_1.default)(conversation, msg, exports.bot);
                break;
            case '/alarmes':
                (0, runAlarmesScene_1.default)(conversation, msg, exports.bot);
                break;
            case '/ajuda':
                break;
            default:
                break;
        }
        if (!conversation) {
            activeConversations = (0, helpers_1.newConversationsList)(chatId, activeConversations, null);
            exports.bot.sendMessage(chatId, `
Comandos Disponíveis:
/membro => Entrar no grupo
/alarmes => Ativar ou desativar alarmes
`);
            return;
        }
        if (!conversation.currentScene) {
            exports.bot.sendMessage(chatId, 'Não entendi, digite /ajuda para saber os comandos disponíveis');
        }
    });
    // Start "/membro" scene
    exports.bot.onText(/\/membro/, msg => {
        const chatId = msg.chat.id;
        let conversation = (0, helpers_1.findCurrentConversation)(chatId, activeConversations);
        const memberScene = {
            command: '/membro',
            currentStep: 'AWAIT_EMAIL',
        };
        if (conversation) {
            conversation.currentScene = memberScene;
            activeConversations = (0, helpers_1.updateConversationsList)(chatId, conversation, activeConversations);
        }
        if (!conversation) {
            activeConversations = (0, helpers_1.newConversationsList)(chatId, activeConversations, memberScene);
        }
        exports.bot.sendMessage(chatId, 'Envie seu email que vamos validar e te enviar o link');
    });
    // Trigger "/ajuda" scene
    exports.bot.onText(/\/ajuda/, msg => {
        const chatId = msg.chat.id;
        exports.bot.sendMessage(chatId, `
<b>Comandos Disponíveis:</b>
/membro => Entrar no grupo
/alarmes => Ativar ou desativar
`, {
            parse_mode: 'HTML',
        });
    });
    exports.bot.onText(/\/sair/, msg => {
        (0, exports.clearConversation)(msg.chat.id);
    });
    exports.bot.onText(/\/ban/, (msg) => __awaiter(void 0, void 0, void 0, function* () {
        const chatId = msg.chat.id;
        if (chatId === exports.groupId)
            return;
        const response = yield BanFromTelegramGroupService_1.default.execute();
        if ((response === null || response === void 0 ? void 0 : response.length) === 0) {
            exports.bot.sendMessage(msg.chat.id, 'A lista está atualizada');
            return;
        }
        response.forEach(memberToBan => {
            exports.bot.banChatMember(exports.groupId, `${memberToBan}`);
            exports.bot.sendMessage(msg.chat.id, `Banned user: ${memberToBan}`);
        });
    }));
    exports.bot.onText(/\/regras/, msg => {
        const chatId = msg.chat.id;
        exports.bot.sendMessage(chatId, rules_1.rules, {
            parse_mode: 'HTML',
        });
    });
    // Start "/alarmes" scene
    exports.bot.onText(/\/alarmes/, msg => {
        const chatId = msg.chat.id;
        let conversation = (0, helpers_1.findCurrentConversation)(chatId, activeConversations);
        const alarmesScene = {
            command: '/alarmes',
            currentStep: 'AWAIT_ALERTAS_COMMAND',
        };
        if (conversation) {
            conversation.currentScene = alarmesScene;
            activeConversations = (0, helpers_1.updateConversationsList)(chatId, conversation, activeConversations);
        }
        if (!conversation) {
            activeConversations = (0, helpers_1.newConversationsList)(chatId, activeConversations, alarmesScene);
        }
        const alarmsMessage = `
Bem vindo ao gerenciador de alarmes.
Digite /status pra saber o status de alarmes da sua conta.
/ativar para ativar ou /desativar para desativar`;
        exports.bot.sendMessage(chatId, alarmsMessage);
    });
});
exports.startBot = startBot;
const stopBot = () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.bot.stopPolling({
        cancel: true,
    });
});
exports.stopBot = stopBot;
//# sourceMappingURL=initializeBot.js.map