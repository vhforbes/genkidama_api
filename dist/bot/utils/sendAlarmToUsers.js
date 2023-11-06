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
const initializeBot_1 = require("../initializeBot");
const sendAlarmToUsers = ({ users, message, ticker, bitgetLink, bybitLink, }) => __awaiter(void 0, void 0, void 0, function* () {
    const messageBitget = `Alarme disparado!
    ${ticker}USDT
    ${message}
    <a href="${bitgetLink}">Acessar ${ticker}USDT na Bitget</a>
    `;
    const messageBybit = `Alarme disparado!
    ${ticker}USDT
    ${message}
    <a href="${bybitLink}">Acessar ${ticker}USDT na Bybit</a>
    `;
    users.forEach((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (user === null || user === void 0 ? void 0 : user.telegramId) {
            try {
                if (user.exchange === 'BITGET' || !user.exchange)
                    yield initializeBot_1.bot.sendMessage(user.telegramId, messageBitget, {
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                    });
                if (user.exchange === 'BYBIT')
                    yield initializeBot_1.bot.sendMessage(user.telegramId, messageBybit, {
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                    });
            }
            catch (err) {
                // Log the error but do nothing else.
                console.error(`Could not send message to ${user.email} due to an error: ${err}`);
            }
        }
    }));
});
exports.default = sendAlarmToUsers;
//# sourceMappingURL=sendAlarmToUsers.js.map