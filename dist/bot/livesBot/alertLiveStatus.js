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
exports.alertLiveClose = exports.alertLiveStart = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const UsersRepository_1 = __importDefault(require("../../repositories/UsersRepository"));
const initializeBot_1 = require("../initializeBot");
const sendMessageToUsers_1 = __importDefault(require("../utils/sendMessageToUsers"));
const groupId = process.env.GROUP_ID;
const alertLiveStart = () => __awaiter(void 0, void 0, void 0, function* () {
    const liveUrl = `www.genkidama.me/live`;
    const users = yield UsersRepository_1.default.memberList();
    const messageHtml = `
<b>ATENÇÃO A LIVE IRÁ COMEÇAR</b> <a href="${liveUrl}">ACESSE AGORA!</a>
Lembre-se de desligar o microfone quando não estiver falando!
`;
    yield (0, sendMessageToUsers_1.default)({ users, messageHtml });
});
exports.alertLiveStart = alertLiveStart;
const alertLiveClose = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield UsersRepository_1.default.memberList();
    const messageHtml = `
<b> --- LIVE ENCERRADA --- </b>
OBRIGADO PELA PARTICIPAÇÃO
`;
    yield (0, sendMessageToUsers_1.default)({ users, messageHtml });
    yield initializeBot_1.bot.sendMessage(groupId, messageHtml, { parse_mode: 'HTML' });
});
exports.alertLiveClose = alertLiveClose;
//# sourceMappingURL=alertLiveStatus.js.map