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
const data_source_1 = require("../data-source");
const TradeOperation_1 = __importDefault(require("../models/TradeOperation"));
const TradeOperationsRepository = data_source_1.AppDataSource.getRepository(TradeOperation_1.default).extend({
    filteredOperations(filter, pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const tradeOperationsQueryResult = yield this.findAndCount({
                where: filter,
                order: {
                    created_at: 'DESC',
                },
                take: pagination.take,
                skip: pagination.skip,
            });
            return tradeOperationsQueryResult;
        });
    },
});
exports.default = TradeOperationsRepository;
//# sourceMappingURL=TradeOperationsRepository.js.map