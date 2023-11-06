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
exports.broadcastNewOperation = void 0;
const UsersRepository_1 = __importDefault(require("../../repositories/UsersRepository"));
const initializeBot_1 = require("../initializeBot");
const sendMessageToUsers_1 = __importDefault(require("../utils/sendMessageToUsers"));
const groupId = process.env.GROUP_ID;
const broadcastNewOperation = (tradeOperation) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, market, 
    // direction,
    // status,
    maxFollowers,
    // observation = '',
     } = tradeOperation;
    const operationUrl = `www.genkidama.me/operations/${id}`;
    const messageHtml = `
<b>NOVA OPERAÇÃO</b>: 
<b>${market}</b>
${`<b>Máximo de seguidores: ${maxFollowers}</b>\n`}
${`<a href="${operationUrl}#seguir">Seguir essa operação!</a>`}
`;
    const users = yield UsersRepository_1.default.memberList();
    yield (0, sendMessageToUsers_1.default)({ users, messageHtml });
    yield initializeBot_1.bot.sendMessage(groupId, messageHtml, { parse_mode: 'HTML' });
});
exports.broadcastNewOperation = broadcastNewOperation;
//# sourceMappingURL=broadcastNewOperation.js.map