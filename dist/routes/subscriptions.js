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
const express_1 = require("express");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const CancelSubscriptionService_1 = __importDefault(require("../services/Subscriptions/CancelSubscriptionService"));
const CreateSubscriptionService_1 = __importDefault(require("../services/Subscriptions/CreateSubscriptionService"));
const SubscriptionStatusService_1 = __importDefault(require("../services/Subscriptions/SubscriptionStatusService"));
const subscriptionsRouter = (0, express_1.Router)();
subscriptionsRouter.get('/status', ensureAuthenticated_1.ensureAutenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const subscriptionStatus = yield SubscriptionStatusService_1.default.execute({
        userId,
    });
    res.json(subscriptionStatus);
}));
subscriptionsRouter.post('/create', ensureAuthenticated_1.ensureAutenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, subscriptionID } = req.body;
    const createdSubscription = yield CreateSubscriptionService_1.default.execute({
        email,
        subscriptionID,
    });
    return res.json(createdSubscription);
}));
subscriptionsRouter.post('/cancel', ensureAuthenticated_1.ensureAutenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paypalSubscriptionId, cancelationReason } = req.body;
    const canceledSubscription = yield CancelSubscriptionService_1.default.execute({
        paypalSubscriptionId: paypalSubscriptionId,
        cancelationReason: cancelationReason,
    });
    return res.json(canceledSubscription);
}));
exports.default = subscriptionsRouter;
//# sourceMappingURL=subscriptions.js.map