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
const sendMessageToUser = ({ user, messageHtml }) => __awaiter(void 0, void 0, void 0, function* () {
    if (user === null || user === void 0 ? void 0 : user.telegramId) {
        try {
            yield initializeBot_1.bot.sendMessage(user.telegramId, messageHtml, {
                parse_mode: 'HTML',
            });
        }
        catch (err) {
            console.error(`Cloud not send message to ${user.email}`);
        }
    }
});
exports.default = sendMessageToUser;
//# sourceMappingURL=sendMessageToUser.js.map