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
class GetFilteredTradeOperationsService {
    static execute(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let pagination = {};
            let page = 1;
            let limit = 1;
            let startIndex = 1;
            let endIndex = 1;
            if (query.page && query.limit) {
                page = parseInt(query.page, 10);
                limit = parseInt(query.limit, 10);
                startIndex = (page - 1) * limit;
                endIndex = page * limit;
                pagination = {
                    take: limit,
                    skip: startIndex,
                };
            }
            const filter = {
                status: query.status,
                direction: query.direction,
            };
            const response = yield TradeOperationsRepository_1.default.filteredOperations(filter, pagination);
            if (!response) {
                throw new AppError_1.default('Unable to make exclusiveVideos query');
            }
            const tradeOperations = (0, responseToCamel_1.arrayToCamel)(response[0]);
            const totalTradeOperations = response[1];
            const results = {
                tradeOperations,
                next: {},
                previous: {},
                totalPages: Math.ceil(totalTradeOperations / limit),
            };
            // Next page number and check if the posts has ended
            if (endIndex > tradeOperations.length &&
                page * limit < totalTradeOperations) {
                results.next = {
                    page: page + 1,
                    limit,
                };
            }
            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit,
                };
            }
            return results;
        });
    }
}
exports.default = GetFilteredTradeOperationsService;
//# sourceMappingURL=getFilteredOperationsService.js.map