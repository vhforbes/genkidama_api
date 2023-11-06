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
const AddTelegramGroupService_1 = __importDefault(require("../../services/Telegram/AddTelegramGroupService"));
const initializeBot_1 = require("../initializeBot");
const rules_1 = require("../html/rules");
const groupId = process.env.GROUP_ID;
const runMemberScene = (conversation, msg, bot) => {
    var _a;
    const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    const chatId = conversation.chatId;
    const revokeLink = (invite_link) => {
        bot.revokeChatInviteLink(-817116434, invite_link);
    };
    const addToGroup = () => __awaiter(void 0, void 0, void 0, function* () {
        var _b, _c;
        const validMail = mailformat.test(msg.text);
        if (!validMail) {
            bot.sendMessage(chatId, 'Email inválido');
            return;
        }
        const email = (_b = msg.text) === null || _b === void 0 ? void 0 : _b.toLowerCase();
        try {
            const response = yield AddTelegramGroupService_1.default.execute({
                email,
                telegramUserId: (_c = msg.from) === null || _c === void 0 ? void 0 : _c.id,
            });
            if (!response.success) {
                bot.sendMessage(chatId, response.messageForBot);
                (0, initializeBot_1.clearConversation)(chatId);
                return;
            }
            bot.sendMessage(msg.chat.id, rules_1.rules);
            const { invite_link } = yield bot.createChatInviteLink(groupId);
            bot.sendMessage(chatId, 'Seja bem vindo, basta clicar no link abaixo para entrar!');
            bot.sendMessage(msg.chat.id, invite_link);
            // COLOCAR UM CASE DE ACORDO COM A RESPONSE DO SERVER MANDAR UMA MSG DIFERENTE
            // O ERRO SOMENTE PARA FALHA NA REQUISICAO
            (0, initializeBot_1.clearConversation)(chatId);
            setTimeout(() => revokeLink(invite_link), 100000);
        }
        catch (err) {
            console.error(err);
        }
    });
    // MANAGE STEPS
    switch ((_a = conversation.currentScene) === null || _a === void 0 ? void 0 : _a.currentStep) {
        case 'AWAIT_EMAIL':
            addToGroup();
            break;
        default:
            break;
    }
};
exports.default = runMemberScene;
//# sourceMappingURL=runMemberScene.js.map