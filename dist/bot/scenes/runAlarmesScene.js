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
const initializeBot_1 = require("../initializeBot");
const UsersRepository_1 = __importDefault(require("../../repositories/UsersRepository"));
const runAlarmesScene = (conversation, msg, bot) => {
    var _a;
    const telegramId = (_a = msg.from) === null || _a === void 0 ? void 0 : _a.id;
    const chatId = conversation.chatId;
    const checkAlarmStatus = () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield UsersRepository_1.default.findOne({ where: { telegramId } });
        if (user === null || user === void 0 ? void 0 : user.sendAlarms) {
            bot.sendMessage(chatId, 'Seus alarmes estão ativados');
        }
        else {
            bot.sendMessage(chatId, 'Seus alarmes estão desativados');
        }
    });
    const activateAlarms = () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield UsersRepository_1.default.findOne({ where: { telegramId } });
        if (user === null || user === void 0 ? void 0 : user.sendAlarms) {
            bot.sendMessage(chatId, 'Seus alarmes já estão ativados');
            (0, initializeBot_1.clearConversation)(chatId);
            return;
        }
        if (!user) {
            bot.sendMessage(chatId, 'Usuário não encontrado, falar com @vhforbes');
            return;
        }
        user.sendAlarms = true;
        yield UsersRepository_1.default.save(user);
        bot.sendMessage(chatId, 'Seus alarmes foram ativados');
        (0, initializeBot_1.clearConversation)(chatId);
    });
    const disableAlarms = () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield UsersRepository_1.default.findOne({ where: { telegramId } });
        if (!(user === null || user === void 0 ? void 0 : user.sendAlarms)) {
            bot.sendMessage(chatId, 'Seus alarmes já estão desativados');
            (0, initializeBot_1.clearConversation)(chatId);
            return;
        }
        if (!user) {
            bot.sendMessage(chatId, 'Usuário não encontrado, falar com @vhforbes');
            return;
        }
        user.sendAlarms = false;
        yield UsersRepository_1.default.save(user);
        bot.sendMessage(chatId, 'Seus alarmes foram desativados');
        (0, initializeBot_1.clearConversation)(chatId);
    });
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
exports.default = runAlarmesScene;
//# sourceMappingURL=runAlarmesScene.js.map