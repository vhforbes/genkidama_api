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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const TradeOperationsRepository_1 = __importDefault(require("../../repositories/TradeOperationsRepository"));
const responseToCamel_1 = require("../../utils/responseToCamel");
class GetTradeOperationHistory {
    static execute(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tradeOperationResponse = yield TradeOperationsRepository_1.default.findOne({
                where: {
                    id,
                },
                relations: ['history', 'history.tradeOperation'],
            });
            if (!tradeOperationResponse) {
                throw new AppError_1.default('Unable to retrieve trade operation');
            }
            const tradeOperation = (0, responseToCamel_1.objToCamel)(tradeOperationResponse);
            if (!tradeOperation.history) {
                throw new AppError_1.default('Unable to retrieve history of trade operation');
            }
            const history = (0, responseToCamel_1.arrayToCamel)(tradeOperation === null || tradeOperation === void 0 ? void 0 : tradeOperation.history);
            delete tradeOperation.history;
            return {
                tradeOperation,
                history,
            };
        });
    }
}
exports.default = GetTradeOperationHistory;
//# sourceMappingURL=getTradeOperationHistory.js.map