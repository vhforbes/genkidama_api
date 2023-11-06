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
const User_1 = __importDefault(require("../../models/User"));
const subscriptionTypes_1 = require("../../enums/subscriptionTypes");
const sendMessageToUser_1 = __importDefault(require("../../bot/utils/sendMessageToUser"));
class CancelSubscriptionService {
    static execute({ userId, cancelationReason, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscriptionRepository = data_source_1.AppDataSource.getRepository(Subscription_1.default);
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.default);
            if (!userId) {
                throw new AppError_1.default('No User ID');
            }
            const user = yield userRepository.findOne({
                where: {
                    id: userId,
                },
                relations: ['subscription'],
            });
            const subscription = user === null || user === void 0 ? void 0 : user.subscription;
            if (!subscription) {
                throw new AppError_1.default('Subscription was not found');
            }
            if (subscription.status !== 'ACTIVE') {
                throw new AppError_1.default('Not a active subscription');
            }
            // ----- CANCEL A PAYPAL SUBSCRIPTION -----
            if (subscription.type === subscriptionTypes_1.subscriptionTypes.paypal &&
                subscription.status === 'ACTIVE') {
                const cancelarionResponse = yield paypalPrivateApi_1.default.post(`/billing/subscriptions/${subscription.paypal_subscription_id}/cancel`, { reason: cancelationReason });
                if (cancelarionResponse.status === 204) {
                    // subscription.status = 'CANCELED';
                    subscription.cancelation_reason = cancelationReason;
                    subscription.canceled_at = new Date().toISOString();
                    yield subscriptionRepository.update(subscription.id, subscription);
                }
            }
            // ----- CANCEL A MANUAL SUBSCRIPTION -----
            if (subscription.status === 'ACTIVE' &&
                subscription.type !== subscriptionTypes_1.subscriptionTypes.paypal) {
                subscription.status = 'CANCELED';
                subscription.cancelation_reason = cancelationReason;
                subscription.canceled_at = new Date().toISOString();
                yield subscriptionRepository.update(subscription.id, subscription);
            }
            (0, sendMessageToUser_1.default)({
                user,
                messageHtml: 'Atenção Kakaroto, sua assinatura foi cancelada. Fico triste em vê-lo partir, espero que iremos nos ver novamente!',
            });
            return subscription;
        });
    }
}
exports.default = CancelSubscriptionService;
//# sourceMappingURL=CancelSubscriptionService.js.map