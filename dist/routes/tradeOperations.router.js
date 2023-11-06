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
/* eslint-disable @typescript-eslint/naming-convention */
const express_1 = require("express");
const ensureAdmin_1 = require("../middlewares/ensureAdmin");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const TradeOperationsRepository_1 = __importDefault(require("../repositories/TradeOperationsRepository"));
const createTradeOperationService_1 = __importDefault(require("../services/TradeOperations/createTradeOperationService"));
const getFilteredOperationsService_1 = __importDefault(require("../services/TradeOperations/getFilteredOperationsService"));
const updateTradeOperationService_1 = __importDefault(require("../services/TradeOperations/updateTradeOperationService"));
const responseToCamel_1 = require("../utils/responseToCamel");
const addUserToTradeOperationService_1 = __importDefault(require("../services/TradeOperations/follow/addUserToTradeOperationService"));
const addTradeOperationToUser_1 = __importDefault(require("../services/TradeOperations/follow/addTradeOperationToUser"));
const getTradeOperationHistory_1 = __importDefault(require("../services/TradeOperationHistory/getTradeOperationHistory"));
const removeUserFromTradeOperationService_1 = __importDefault(require("../services/TradeOperations/follow/removeUserFromTradeOperationService"));
const removeTradeOperationFromUserService_1 = __importDefault(require("../services/TradeOperations/follow/removeTradeOperationFromUserService"));
const deleteTradeOperationService_1 = __importDefault(require("../services/TradeOperations/deleteTradeOperationService"));
const getTradeOperationsResumeService_1 = __importDefault(require("../services/TradeOperations/getTradeOperationsResumeService"));
const listTradeOperationsService_1 = __importDefault(require("../services/TradeOperations/listTradeOperationsService"));
const updateRiskRewardRatioService_1 = __importDefault(require("../services/TradeOperations/updateRiskRewardRatioService"));
const tradeOperationsRouter = (0, express_1.Router)();
// tradeOperationsRouter.use(ensureAutenticated);
tradeOperationsRouter.get('/', ensureAuthenticated_1.ensureAutenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tradeOperationsRepository = TradeOperationsRepository_1.default;
    if (Object.keys(req.query).length !== 0) {
        // OPERATIONS WITH A QUERY
        const response = yield getFilteredOperationsService_1.default.execute(req.query);
        res.json(response);
    }
    else {
        // RETURN ALL THE OPERATIONS
        const tradeOperations = yield tradeOperationsRepository.find({
            order: {
                updated_at: 'DESC',
            },
            relations: ['users'],
        });
        res.json((0, responseToCamel_1.arrayToCamel)(tradeOperations));
    }
}));
tradeOperationsRouter.post('/', ensureAuthenticated_1.ensureAutenticated, ensureAdmin_1.ensureAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = req.body;
    request.authorId = req.user.id;
    const requestResult = yield createTradeOperationService_1.default.execute(request);
    res.json(requestResult);
}));
tradeOperationsRouter.put('/', ensureAuthenticated_1.ensureAutenticated, ensureAdmin_1.ensureAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tradeOperation = req.body;
    const result = yield updateTradeOperationService_1.default.execute(tradeOperation);
    res.json((0, responseToCamel_1.objToCamel)(result));
}));
tradeOperationsRouter.delete('/', ensureAuthenticated_1.ensureAutenticated, ensureAdmin_1.ensureAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const result = yield deleteTradeOperationService_1.default.execute({
        id: id,
    });
    res.json((0, responseToCamel_1.objToCamel)(result));
}));
tradeOperationsRouter.post('/follow', ensureAuthenticated_1.ensureAutenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = req.body;
    const tradeOperation = yield addUserToTradeOperationService_1.default.execute(req.user.id, request.tradeOperationId);
    const user = yield addTradeOperationToUser_1.default.execute(req.user.id, request.tradeOperationId);
    res.json({ tradeOperation, user });
}));
tradeOperationsRouter.post('/unfollow', ensureAuthenticated_1.ensureAutenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const request = req.body;
    const tradeOperation = yield removeUserFromTradeOperationService_1.default.execute(req.user.id, request.tradeOperationId);
    const user = yield removeTradeOperationFromUserService_1.default.execute(req.user.id, request.tradeOperationId);
    res.json({ tradeOperation, user });
}));
tradeOperationsRouter.get('/history', ensureAuthenticated_1.ensureAutenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const requestResult = yield getTradeOperationHistory_1.default.execute(id);
    res.json(requestResult);
}));
tradeOperationsRouter.get('/resume', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { period } = req.query;
    const requestResult = yield getTradeOperationsResumeService_1.default.execute({
        periodInDays: parseInt(period, 10),
    });
    res.json(requestResult);
}));
tradeOperationsRouter.get('/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestResult = yield listTradeOperationsService_1.default.execute();
    res.json(requestResult);
}));
tradeOperationsRouter.post('/updateRiskReturnRatio', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resp = yield updateRiskRewardRatioService_1.default.execute();
    res.json(resp);
}));
exports.default = tradeOperationsRouter;
//# sourceMappingURL=tradeOperations.router.js.map