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
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const TradeOperation_1 = __importDefault(require("../../../models/TradeOperation"));
const User_1 = __importDefault(require("../../../models/User"));
const data_source_1 = require("../../../data-source");
class AddUserToTradeOperation {
    static execute(userId, tradeOperationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.default);
            const tradeOperationRepository = data_source_1.AppDataSource.getRepository(TradeOperation_1.default);
            const user = yield userRepository.findOne({
                where: { id: userId },
            });
            if (!(user === null || user === void 0 ? void 0 : user.telegramId)) {
                throw new AppError_1.default('Não encotramos seu ID do telegram... Fale com o @MestreKamee_bot');
            }
            const tradeOperation = yield tradeOperationRepository.findOne({
                where: { id: tradeOperationId },
                relations: ['users'],
            });
            if ((tradeOperation === null || tradeOperation === void 0 ? void 0 : tradeOperation.currentFollowers) === (tradeOperation === null || tradeOperation === void 0 ? void 0 : tradeOperation.maxFollowers)) {
                throw new AppError_1.default('A operação está cheia');
            }
            if (!user) {
                throw new AppError_1.default('User not found');
            }
            if (!tradeOperation) {
                throw new AppError_1.default('Trade operation not found');
            }
            const isAlreadyFollowing = tradeOperation === null || tradeOperation === void 0 ? void 0 : tradeOperation.users.filter(currentUser => currentUser.id === userId);
            if ((isAlreadyFollowing === null || isAlreadyFollowing === void 0 ? void 0 : isAlreadyFollowing.length) !== 0) {
                throw new AppError_1.default('You are already following this operation');
            }
            tradeOperation.currentFollowers += 1;
            tradeOperation.users = [...tradeOperation.users, user];
            yield tradeOperationRepository.save(tradeOperation);
            return tradeOperation;
        });
    }
}
exports.default = AddUserToTradeOperation;
//# sourceMappingURL=addUserToTradeOperationService.js.map