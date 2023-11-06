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
const data_source_1 = require("../../../data-source");
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const TradeOperation_1 = __importDefault(require("../../../models/TradeOperation"));
class RemoveUserFromTradeOperation {
    static execute(userId, tradeOperationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tradeOperationRepository = data_source_1.AppDataSource.getRepository(TradeOperation_1.default);
            const tradeOperation = yield tradeOperationRepository.findOne({
                where: { id: tradeOperationId },
                relations: ['users'],
            });
            if (!tradeOperation) {
                throw new AppError_1.default('trade operation not found');
            }
            const indexToRemove = tradeOperation === null || tradeOperation === void 0 ? void 0 : tradeOperation.users.findIndex(user => user.id === userId);
            if (indexToRemove === -1) {
                throw new AppError_1.default('User not found for trade operation');
            }
            tradeOperation.users.splice(indexToRemove, 1);
            tradeOperation.currentFollowers -= 1;
            yield tradeOperationRepository.save(tradeOperation);
            return tradeOperation;
        });
    }
}
exports.default = RemoveUserFromTradeOperation;
//# sourceMappingURL=removeUserFromTradeOperationService.js.map