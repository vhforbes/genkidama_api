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
// EMAIL SERVICE TO-BE IMPLEMENTED WHEN EMAIL ONLINE
class BanFromTelegramGroupService {
    static execute() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.default);
            const users = yield userRepository.find({
                relations: { subscription: true },
            });
            const chatIdsToBan = [];
            for (let i = 0; i < users.length; i += 1) {
                const user = users[i];
                if (user.role !== roles_1.roles.admin &&
                    user.role !== roles_1.roles.member &&
                    ((_a = user.subscription) === null || _a === void 0 ? void 0 : _a.status) !== 'ACTIVE' &&
                    user.onTelegramGroup) {
                    console.log('BANIDO', user.email, user.telegramId);
                    chatIdsToBan.push(user.telegramId);
                    user.onTelegramGroup = false;
                    // eslint-disable-next-line no-await-in-loop
                    yield userRepository.save(user);
                }
            }
            return chatIdsToBan;
        });
    }
}
exports.default = BanFromTelegramGroupService;
//# sourceMappingURL=BanFromTelegramGroupService.js.map