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
const AppError_1 = __importDefault(require("../errors/AppError"));
const CancelSubscriptionService_1 = __importDefault(require("../services/Subscriptions/CancelSubscriptionService"));
const UpdateSubscriptionService_1 = __importDefault(require("../services/Subscriptions/UpdateSubscriptionService"));
const paypalRouter = (0, express_1.Router)();
paypalRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { event_type, resource } = req.body;
    let serviceResponse = null;
    switch (event_type) {
        case 'BILLING.SUBSCRIPTION.CANCELLED':
            serviceResponse = yield CancelSubscriptionService_1.default.execute({
                paypalSubscriptionId: resource.id,
            });
            break;
        case 'BILLING.SUBSCRIPTION.EXPIRED':
            serviceResponse = yield CancelSubscriptionService_1.default.execute({
                paypalSubscriptionId: resource.id,
            });
            break;
        case 'BILLING.SUBSCRIPTION.UPDATED':
            serviceResponse = yield UpdateSubscriptionService_1.default.execute({
                paypalSubscriptionId: resource.id,
                current_period_end: resource.final_payment_due_date,
            });
            break;
        case 'BILLING.SUBSCRIPTION.RE-ACTIVATED':
            serviceResponse = yield UpdateSubscriptionService_1.default.execute({
                paypalSubscriptionId: resource.id,
                current_period_end: resource.final_payment_due_date,
            });
            break;
        default:
            throw new AppError_1.default(`Webhhok event ${event_type} not mapped`, 200);
            break;
    }
    res.json({ serviceResponse });
}));
exports.default = paypalRouter;
//# sourceMappingURL=paypal.router.js.map