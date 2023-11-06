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
const updateOperationToGroup_1 = require("../../bot/tradeOperationsBot/updateOperationToGroup");
const sendMessageToAdmins_1 = __importDefault(require("../../bot/utils/sendMessageToAdmins"));
const data_source_1 = require("../../data-source");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const TradeOperation_1 = __importDefault(require("../../models/TradeOperation"));
const replaceCommasWithDots_1 = require("../../utils/replaceCommasWithDots");
const createTradeOperationHistoryService_1 = __importDefault(require("../TradeOperationHistory/createTradeOperationHistoryService"));
class UpdateTradeOperationService {
    static execute(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tradeOperationsRepository = data_source_1.AppDataSource.getRepository(TradeOperation_1.default);
                // Substitui as , com pontos
                const cleanRequest = (0, replaceCommasWithDots_1.replaceCommasWithDots)(request);
                // Desestruturaçao para utilizar os valores
                const { id, market, status, direction, entryOrderOne, entryOrderTwo, entryOrderThree, takeProfitOne, takeProfitTwo, stop, result, observation, percentual, maxFollowers, tradingViewLink, stopDistance, } = cleanRequest;
                if (!id) {
                    throw new AppError_1.default('You must provide a ID');
                }
                // Checa se a operacao existe
                const tradeOperationToUpdate = yield tradeOperationsRepository.findOne({
                    where: {
                        id,
                    },
                    relations: ['history', 'users'],
                });
                if (!tradeOperationToUpdate) {
                    throw new AppError_1.default(`Trade operation ${id} could not be found`);
                }
                if (status) {
                    const validStatuses = ['aguardando', 'ativa', 'fechada'];
                    if (!validStatuses.includes(status)) {
                        // Notificar ADM
                        throw new AppError_1.default('Unauthorized status for trade operation update');
                    }
                }
                // Salva a operacao encontrada para o histórico
                const history = yield createTradeOperationHistoryService_1.default.execute(tradeOperationToUpdate);
                if (!history) {
                    throw new AppError_1.default('Could not create history for update');
                }
                tradeOperationToUpdate.history.push(history);
                const assignOrDefault = (input, defaultValue) => {
                    return input ? parseFloat(input) : defaultValue;
                };
                const calcRiskReturnRatio = (perc, stopdist) => {
                    if (perc && stopdist) {
                        return perc / stopdist;
                    }
                    return 0;
                };
                // Cria um objeto com a operacao nova:
                //
                const updatedTradeOperation = {
                    id,
                    market: market === null || market === void 0 ? void 0 : market.trimEnd(),
                    status: status || tradeOperationToUpdate.status,
                    direction: direction || tradeOperationToUpdate.direction,
                    entry_order_one: assignOrDefault(entryOrderOne, tradeOperationToUpdate.entry_order_one),
                    entry_order_two: assignOrDefault(entryOrderTwo, tradeOperationToUpdate.entry_order_two),
                    entry_order_three: assignOrDefault(entryOrderThree, tradeOperationToUpdate.entry_order_three),
                    take_profit_one: assignOrDefault(takeProfitOne, tradeOperationToUpdate.take_profit_one),
                    take_profit_two: assignOrDefault(takeProfitTwo, tradeOperationToUpdate.take_profit_two),
                    stop: assignOrDefault(stop, tradeOperationToUpdate.stop),
                    result: result || tradeOperationToUpdate.result,
                    percentual: assignOrDefault(percentual, tradeOperationToUpdate.percentual),
                    riskReturnRatio: calcRiskReturnRatio(parseFloat(percentual), parseFloat(stopDistance)),
                    stopDistance: assignOrDefault(stopDistance, tradeOperationToUpdate.stopDistance),
                    observation: observation || tradeOperationToUpdate.observation || '',
                    version: tradeOperationToUpdate.version + 1,
                    maxFollowers: maxFollowers || tradeOperationToUpdate.maxFollowers,
                    tradingViewLink,
                };
                // Clean it up so the invalid values are not sent to the DB
                const cleanUpdatedTradeOperation = Object.fromEntries(Object.entries(updatedTradeOperation).filter(([_, v]) => v != null && !Number.isNaN(v)));
                yield tradeOperationsRepository.save(cleanUpdatedTradeOperation);
                const afterUpdateTradeOperation = yield tradeOperationsRepository.findOne({
                    where: {
                        id,
                    },
                });
                if (!afterUpdateTradeOperation) {
                    throw new AppError_1.default('Could not find operation after update');
                }
                // Avoids breaking if there is no telegramID
                const usersWithTelegramID = tradeOperationToUpdate.users.filter((user) => user.telegramId !== null);
                (0, updateOperationToGroup_1.updateOperationToGroup)(afterUpdateTradeOperation, usersWithTelegramID);
                return afterUpdateTradeOperation;
            }
            catch (error) {
                console.error(error); // Log the error for debugging
                const message = error && typeof error.message === 'string'
                    ? error.message
                    : 'An unexpected error occurred';
                yield (0, sendMessageToAdmins_1.default)({
                    messageHtml: `
        Error updating trade operation:
        ${message}`,
                });
                throw error;
            }
        });
    }
}
exports.default = UpdateTradeOperationService;
//# sourceMappingURL=updateTradeOperationService.js.map