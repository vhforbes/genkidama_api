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
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const CancelSubscriptionService_1 = __importDefault(require("../services/Subscriptions/CancelSubscriptionService"));
const CreatePaypalSubscriptionService_1 = __importDefault(require("../services/Subscriptions/CreatePaypalSubscriptionService"));
const SubscriptionStatusService_1 = __importDefault(require("../services/Subscriptions/SubscriptionStatusService"));
const CreateManualSubscriptionService_1 = __importDefault(require("../services/Subscriptions/CreateManualSubscriptionService"));
const ensureAdmin_1 = require("../middlewares/ensureAdmin");
const UpdateSubscriptionService_1 = __importDefault(require("../services/Subscriptions/UpdateSubscriptionService"));
const CheckAllSubs_1 = __importDefault(require("../services/Subscriptions/CheckAllSubs"));
const sendMessageToAdmins_1 = __importDefault(require("../bot/utils/sendMessageToAdmins"));
const subscriptionsRouter = (0, express_1.Router)();
subscriptionsRouter.get('/status', ensureAuthenticated_1.ensureAutenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const subscriptionStatus = yield SubscriptionStatusService_1.default.execute({
        userId,
    });
    res.json(subscriptionStatus);
}));
subscriptionsRouter.put('/update/:id', ensureAuthenticated_1.ensureAutenticated, ensureAdmin_1.ensureAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedSubscription = yield UpdateSubscriptionService_1.default.execute(req.body);
    res.json(updatedSubscription);
}));
subscriptionsRouter.post('/createPayapalSubscription', ensureAuthenticated_1.ensureAutenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, subscriptionID } = req.body;
    (0, sendMessageToAdmins_1.default)({
        messageHtml: `Subscription sendo criada, checando corpo para identificar erro ${JSON.stringify(req.body)}`,
    });
    const createdSubscription = yield CreatePaypalSubscriptionService_1.default.execute({
        email,
        paypal_subscription_id: subscriptionID,
    });
    return res.json(createdSubscription);
}));
subscriptionsRouter.post('/createManualSubscription', ensureAuthenticated_1.ensureAutenticated, ensureAdmin_1.ensureAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, type, current_period_end } = req.body;
    const createdSubscription = yield CreateManualSubscriptionService_1.default.execute({
        email,
        type,
        current_period_end,
    });
    return res.json(createdSubscription);
}));
subscriptionsRouter.post('/cancel', ensureAuthenticated_1.ensureAutenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cancelationReason } = req.body;
    const userId = req.user.id;
    const canceledSubscription = yield CancelSubscriptionService_1.default.execute({
        userId,
        cancelationReason: cancelationReason,
    });
    return res.json(canceledSubscription);
}));
subscriptionsRouter.post('/checkAllSubs', ensureAuthenticated_1.ensureAutenticated, ensureAdmin_1.ensureAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield CheckAllSubs_1.default.execute();
    return res.json(response);
}));
exports.default = subscriptionsRouter;
//# sourceMappingURL=subscriptions.js.map