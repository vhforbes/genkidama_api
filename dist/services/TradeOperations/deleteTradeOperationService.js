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
const deleteOperation_1 = require("../../bot/tradeOperationsBot/deleteOperation");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const TradeOperationsRepository_1 = __importDefault(require("../../repositories/TradeOperationsRepository"));
class DeleteTradeOperationService {
    static execute({ id, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const tradeOperationsRepository = TradeOperationsRepository_1.default;
            const tradeOperation = yield tradeOperationsRepository.findOne({
                where: {
                    id: id,
                },
            });
            if (!tradeOperation) {
                throw new AppError_1.default('Could not find trade operation to delete');
            }
            const result = yield tradeOperationsRepository.remove(tradeOperation);
            result.id = id;
            yield (0, deleteOperation_1.deleteOperation)(result);
            return result;
        });
    }
}
exports.default = DeleteTradeOperationService;
//# sourceMappingURL=deleteTradeOperationService.js.map