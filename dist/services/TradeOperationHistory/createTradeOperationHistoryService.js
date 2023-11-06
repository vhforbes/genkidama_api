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
const TradeOperationHistory_1 = __importDefault(require("../../models/TradeOperationHistory"));
class CreateTradeOperationHistoryService {
    static execute(tradeOperationToUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            const tradeOperationHistoryRepository = data_source_1.AppDataSource.getRepository(TradeOperationHistory_1.default);
            const history = {};
            history.market = tradeOperationToUpdate.market;
            history.direction = tradeOperationToUpdate.direction;
            history.status = tradeOperationToUpdate.status;
            history.entry_order_one = tradeOperationToUpdate.entry_order_one;
            history.entry_order_two = tradeOperationToUpdate.entry_order_two;
            history.entry_order_three = tradeOperationToUpdate.entry_order_three;
            history.take_profit_one = tradeOperationToUpdate.take_profit_one;
            history.take_profit_two = tradeOperationToUpdate.take_profit_two;
            history.stop = tradeOperationToUpdate.stop;
            history.result = tradeOperationToUpdate.result;
            history.percentual = tradeOperationToUpdate.percentual;
            history.observation = tradeOperationToUpdate.observation;
            history.version = tradeOperationToUpdate.version;
            history.tradeOperation = tradeOperationToUpdate;
            tradeOperationHistoryRepository.save(history);
            return history;
        });
    }
}
exports.default = CreateTradeOperationHistoryService;
//# sourceMappingURL=createTradeOperationHistoryService.js.map