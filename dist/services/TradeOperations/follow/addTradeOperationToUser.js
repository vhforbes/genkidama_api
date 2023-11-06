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
const followingSucessfully_1 = require("../../../bot/tradeOperationsBot/followingSucessfully");
const data_source_1 = require("../../../data-source");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const TradeOperation_1 = __importDefault(require("../../../models/TradeOperation"));
const User_1 = __importDefault(require("../../../models/User"));
class AddTradeOperationToUser {
    static execute(userId, tradeOperationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.default);
            const tradeOperationRepository = data_source_1.AppDataSource.getRepository(TradeOperation_1.default);
            const user = yield userRepository.findOne({
                where: { id: userId },
                relations: ['tradeOperations'],
            });
            const tradeOperation = yield tradeOperationRepository.findOne({
                where: { id: tradeOperationId },
            });
            if (!user) {
                throw new AppError_1.default('user not found');
            }
            if (!tradeOperation) {
                throw new AppError_1.default('trade operation not found');
            }
            if (!user.telegramId) {
                throw new AppError_1.default('Cant to follow if user dont have telegram id');
            }
            user.tradeOperations = [...user.tradeOperations, tradeOperation];
            yield userRepository.save(user);
            (0, followingSucessfully_1.followingSucessfully)(tradeOperation, user.telegramId);
            return user;
        });
    }
}
exports.default = AddTradeOperationToUser;
//# sourceMappingURL=addTradeOperationToUser.js.map