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
const User_1 = __importDefault(require("../../models/User"));
const paypalPrivateApi_1 = __importDefault(require("../../apis/paypalPrivateApi"));
/*
  [] Receive webhook
  [] Validate webhook validity
  [] Sort event type
  [] Create or Update Subscription
*/
class CreateSubscriptionService {
    static execute({ email, subscriptionID }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.default);
            const subscriptionRepository = data_source_1.AppDataSource.getRepository(Subscription_1.default);
            const user = yield userRepository.findOne({
                where: { email },
            });
            if (!user) {
                throw new AppError_1.default('User not found');
            }
            // CHECKS IF USER HAS A ACTIVE SUBSCRIPTION
            if (user.subscription_id) {
                const subscription = yield subscriptionRepository.findOne({
                    where: { id: user.subscription_id },
                });
                if (!subscription) {
                    throw new AppError_1.default('User subscription was not found');
                }
                if (subscription.status === 'ACTIVE') {
                    throw new AppError_1.default('User already has a active subscription, update it instead');
                }
            }
            const { data } = yield (0, paypalPrivateApi_1.default)(`/billing/subscriptions/${subscriptionID}`);
            if (!data) {
                throw new AppError_1.default('Unable to retrive subscriptions details');
            }
            const subscription = subscriptionRepository.create({
                user_id: user.id,
                paypal_subscription_id: subscriptionID,
                plan_id: data.plan_id,
                status: 'ACTIVE',
                current_period_start: data.start_time,
                current_period_end: data.billing_info.next_billing_time,
            });
            const createdSubscription = yield subscriptionRepository.save(subscription);
            user.subscription = createdSubscription;
            yield userRepository.save(user);
            return {
                subscription: subscription,
            };
        });
    }
}
exports.default = CreateSubscriptionService;
//# sourceMappingURL=CreateSubscriptionService.js.map