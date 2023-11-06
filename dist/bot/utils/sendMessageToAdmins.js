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
/* eslint-disable no-restricted-syntax */
const UsersRepository_1 = __importDefault(require("../../repositories/UsersRepository"));
const initializeBot_1 = require("../initializeBot");
const sendMessageToAdmins = ({ messageHtml }) => __awaiter(void 0, void 0, void 0, function* () {
    const admins = yield UsersRepository_1.default.adminsList();
    admins.forEach((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (user === null || user === void 0 ? void 0 : user.telegramId) {
            try {
                yield initializeBot_1.bot.sendMessage(user.telegramId, messageHtml, {
                    parse_mode: 'HTML',
                    disable_web_page_preview: true,
                });
            }
            catch (err) {
                // Log the error but do nothing else.
                console.error(`Could not send message to ADMIN ${user.email} due to an error: ${err}`);
            }
        }
    }));
});
exports.default = sendMessageToAdmins;
//# sourceMappingURL=sendMessageToAdmins.js.map