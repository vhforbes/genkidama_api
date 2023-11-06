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
Object.defineProperty(exports, "__esModule", { value: true });
exports.followingSucessfully = void 0;
const initializeBot_1 = require("../initializeBot");
const followingSucessfully = (tradeOperation, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, market, direction, status,
    // observation = '',
     } = tradeOperation;
    const operationUrl = `www.genkidama.me/operations/${id}`;
    const messageHtml = `
<b>VOCÊ ESTÁ SEGUINDO A OPERAÇÃO</b>: 
<b>${market}</b> | ${direction} | ${status}
${`<a href="${operationUrl}">Acessar operação</a>`}
`;
    yield initializeBot_1.bot.sendMessage(userId, messageHtml, { parse_mode: 'HTML' });
});
exports.followingSucessfully = followingSucessfully;
//# sourceMappingURL=followingSucessfully.js.map