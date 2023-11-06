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
const data_source_1 = require("../../data-source");
const roles_1 = require("../../enums/roles");
const User_1 = __importDefault(require("../../models/User"));
class AddTelegramGroupService {
    static execute({ email, telegramUserId, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.default);
            const user = yield userRepository.findOne({
                where: { email },
                relations: { subscription: true },
            });
            if (!user) {
                return {
                    success: false,
                    messageForBot: 'Não conseguimos encontrar um usuario com esse email..',
                };
            }
            if (user.onTelegramGroup) {
                return {
                    success: false,
                    messageForBot: 'Parece que você já está no grupo!',
                };
            }
            if (((_a = user.subscription) === null || _a === void 0 ? void 0 : _a.status) !== 'ACTIVE' &&
                user.role !== roles_1.roles.member &&
                user.role !== roles_1.roles.admin) {
                return {
                    success: false,
                    messageForBot: 'Sua assinatura não está ativa. Assine novamente na genkidama.me!',
                };
            }
            user.onTelegramGroup = true;
            user.telegramId = telegramUserId;
            yield userRepository.save(user);
            return {
                success: true,
                messageForBot: 'Sucesso',
            };
        });
    }
}
exports.default = AddTelegramGroupService;
//# sourceMappingURL=AddTelegramGroupService.js.map