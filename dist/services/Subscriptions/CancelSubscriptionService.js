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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Subscription_1 = __importDefault(require("../../models/Subscription"));
const paypalPrivateApi_1 = __importDefault(require("../../apis/paypalPrivateApi"));
/*
  [] Receive webhook
  [] Validate webhook validity
  [] Sort event type
  [] Create or Update Subscription
*/
class CancelSubscriptionService {
    static execute({ paypalSubscriptionId, cancelationReason, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscriptionRepository = data_source_1.AppDataSource.getRepository(Subscription_1.default);
            const subscription = yield subscriptionRepository.findOne({
                where: { paypal_subscription_id: paypalSubscriptionId },
            });
            if (!subscription) {
                throw new AppError_1.default('Subscription was not found');
            }
            if (subscription.status !== 'ACTIVE') {
                throw new AppError_1.default('Not a active subscription');
            }
            if (subscription.status === 'ACTIVE') {
                const cancelResponse = yield paypalPrivateApi_1.default.post(`/billing/subscriptions/${subscription.paypal_subscription_id}/cancel`, { reason: 'watever' });
                if (cancelResponse.status === 204) {
                    subscription.status = 'CANCELED';
                    subscription.cancelation_reason = cancelationReason;
                    subscription.canceled_at = new Date().toISOString();
                    yield subscriptionRepository.update(subscription.id, subscription);
                }
            }
            return subscription;
        });
    }
}
exports.default = CancelSubscriptionService;
//# sourceMappingURL=CancelSubscriptionService.js.map