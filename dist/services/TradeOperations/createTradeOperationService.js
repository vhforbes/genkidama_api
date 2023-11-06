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
const broadcastNewOperation_1 = require("../../bot/tradeOperationsBot/broadcastNewOperation");
const data_source_1 = require("../../data-source");
const TradeOperation_1 = __importDefault(require("../../models/TradeOperation"));
const replaceCommasWithDots_1 = require("../../utils/replaceCommasWithDots");
class CreateTradeOperationService {
    static execute(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const tradeOperationsRepository = data_source_1.AppDataSource.getRepository(TradeOperation_1.default);
            const cleanRequest = (0, replaceCommasWithDots_1.replaceCommasWithDots)(request);
            const { authorId, maxFollowers, market, status, direction, entryOrderOne, entryOrderTwo, entryOrderThree, takeProfitOne, takeProfitTwo, stop, result, percentual, observation, tradingViewLink, stopDistance, } = cleanRequest;
            const tradeOperation = tradeOperationsRepository.create({
                author_id: authorId,
                market: market.trimEnd(),
                maxFollowers,
                status,
                direction,
                entry_order_one: parseFloat(entryOrderOne),
                entry_order_two: entryOrderTwo ? parseFloat(entryOrderTwo) : null,
                entry_order_three: entryOrderThree ? parseFloat(entryOrderThree) : null,
                take_profit_one: parseFloat(takeProfitOne),
                take_profit_two: takeProfitTwo ? parseFloat(takeProfitTwo) : null,
                stop: parseFloat(stop),
                result,
                observation,
                percentual: percentual ? parseFloat(percentual) : null,
                stopDistance: stopDistance ? parseFloat(stopDistance) : null,
                tradingViewLink,
            });
            const results = yield tradeOperationsRepository.save(tradeOperation);
            (0, broadcastNewOperation_1.broadcastNewOperation)(tradeOperation);
            return results;
        });
    }
}
exports.default = CreateTradeOperationService;
//# sourceMappingURL=createTradeOperationService.js.map