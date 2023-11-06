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
const typeorm_1 = require("typeorm");
const data_source_1 = require("../../data-source");
const TradeOperation_1 = __importDefault(require("../../models/TradeOperation"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
class GetTradeOperationsResumeService {
    static execute({ periodInDays, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const tradeRepo = data_source_1.AppDataSource.getRepository(TradeOperation_1.default);
            if (!periodInDays) {
                throw new AppError_1.default('No period sent in payload');
            }
            // Calculate date from periodInDays ago till now
            const fromDate = new Date();
            fromDate.setDate(fromDate.getDate() - periodInDays);
            // Fetch all trade operations within this period
            const trades = yield tradeRepo.find({
                where: [
                    {
                        created_at: (0, typeorm_1.Between)(fromDate, new Date()),
                        status: 'fechada',
                        result: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
                        percentual: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
                    },
                    {
                        created_at: (0, typeorm_1.Between)(fromDate, new Date()),
                        status: 'fechada',
                        result: (0, typeorm_1.Not)(''),
                    },
                ],
            });
            const totalOperations = trades.length;
            const gainOperations = trades.filter(trade => trade.result === 'gain').length;
            const lossOperations = trades.filter(trade => trade.result === 'loss').length;
            const evenOperations = trades.filter(trade => trade.result === 'even').length;
            const gainPercentage = (gainOperations / totalOperations) * 100;
            const lossPercentage = (lossOperations / totalOperations) * 100;
            const evenPercentage = (evenOperations / totalOperations) * 100;
            const totalProfitPercentage = trades.reduce((sum, trade) => sum + trade.percentual, 0);
            const totalRiskReturnRatio = () => {
                const riskReturns = [];
                trades.forEach(trade => {
                    if (trade.riskReturnRatio) {
                        riskReturns.push(trade.riskReturnRatio);
                    }
                });
                let sum = riskReturns.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
                return sum;
            };
            return {
                totalOperations,
                gainPercentage,
                lossPercentage,
                evenPercentage,
                totalProfitPercentage,
                totalRiskReturnRatio: totalRiskReturnRatio(),
            };
        });
    }
}
exports.default = GetTradeOperationsResumeService;
//# sourceMappingURL=getTradeOperationsResumeService.js.map