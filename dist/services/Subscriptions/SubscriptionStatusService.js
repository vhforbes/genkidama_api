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
const paypalPrivateApi_1 = __importDefault(require("../../apis/paypalPrivateApi"));
const sendMessageToUser_1 = __importDefault(require("../../bot/utils/sendMessageToUser"));
const data_source_1 = require("../../data-source");
const subscriptionTypes_1 = require("../../enums/subscriptionTypes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Subscription_1 = __importDefault(require("../../models/Subscription"));
const User_1 = __importDefault(require("../../models/User"));
class SubscriptionStatusService {
    static execute({ userId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.default);
            const subscriptionRepository = data_source_1.AppDataSource.getRepository(Subscription_1.default);
            const user = yield userRepository.findOne({
                where: { id: userId },
                relations: ['subscription'],
            });
            if (!user)
                throw new AppError_1.default('User was not found');
            if (user.role === 'ADMIN')
                return { status: 'ADMIN USER' };
            const subscription = user.subscription;
            if (!subscription) {
                return {
                    status: 'NO SUBSCRIPTION FOUND',
                };
            }
            // ---- Exits logic if its a lifetime subscription ----
            if (subscription.type === subscriptionTypes_1.subscriptionTypes.betaTester ||
                subscription.type === subscriptionTypes_1.subscriptionTypes.vip ||
                subscription.type === subscriptionTypes_1.subscriptionTypes.vip)
                return { status: 'ACCESS GRANTED' };
            // ---- VALIDATE PAYMENT AND FILL UP THE INFO IF SUBSCRIPTION IS INCOMPLETE  ----
            if (!subscription.verified &&
                subscription.type === subscriptionTypes_1.subscriptionTypes.paypal) {
                try {
                    console.log('VERIFYING SUB FOR: ', user.email);
                    const { data } = yield (0, paypalPrivateApi_1.default)(`/billing/subscriptions/${subscription.paypal_subscription_id}`);
                    if (data.status === 'ACTIVE') {
                        subscription.plan_id = data.plan_id;
                        subscription.current_period_start = data.start_time;
                        subscription.current_period_end = data.billing_info.next_billing_time;
                        subscriptionRepository.save(subscription);
                        subscription.verified = true;
                    }
                }
                catch (error) {
                    console.error(error);
                    throw new AppError_1.default('Unable to retrive subscriptions details');
                }
            }
            // ---- CHECKS IS SUBSCRIPTION IS EXPIRED OR NOT ----
            const expirationDate = Date.parse(subscription.current_period_end);
            const todayDate = Date.now();
            // -- Vai fazer a checagem de cancelamento em breve e manda um aviso. --
            // const willExpireSoon = todayDate > expirationDate;
            // if (willExpireSoon && subscription.type === 'ACTIVE') {
            //   const willExpireMessage = `Atenção Kakaroto, sua assinatura está prestes a expirar. Confira se suas informações de pagamento ou entre em contato com o @vhforbes para evitar o cancelameno da sua assinatura.`;
            //   sendMessageToUser({ user, messageHtml: willExpireMessage });
            // }
            const bufferDays = 1;
            const millisecondsPerDay = 24 * 60 * 60 * 1000;
            const bufferedExpirationDate = expirationDate + bufferDays * millisecondsPerDay;
            const isExpired = todayDate > bufferedExpirationDate;
            const sendCancelationMessage = () => {
                const expiredMessage = `Atenção Kakaroto, sua assinatura foi cancelada... Caso você ache que isso é um erro, entre em contato com o @vhforbes.`;
                (0, sendMessageToUser_1.default)({ user, messageHtml: expiredMessage });
            };
            if (subscription.type !== subscriptionTypes_1.subscriptionTypes.paypal &&
                subscription.status === 'ACTIVE' &&
                isExpired) {
                subscription.status = 'CANCELED';
                subscription.canceled_at = new Date().toISOString();
                subscription.cancelation_reason = 'Cancelada pelo sistema';
                subscriptionRepository.save(subscription);
                // Avoid sending cancelation and will cancel message
                if (!isExpired)
                    sendCancelationMessage();
            }
            if (subscription.type === subscriptionTypes_1.subscriptionTypes.paypal &&
                subscription.status === 'ACTIVE' &&
                isExpired) {
                const { data } = yield (0, paypalPrivateApi_1.default)(`/billing/subscriptions/${subscription.paypal_subscription_id}`);
                if (!data) {
                    throw new AppError_1.default('Unable to retrive subscriptions details');
                }
                // Atualiza a data de cobrança
                if (data.status === 'ACTIVE') {
                    subscription.current_period_end = data.billing_info.next_billing_time;
                    subscriptionRepository.save(subscription);
                }
                // Cancela a subscription
                if (data.status === 'CANCELLED' || data.status === 'SUSPENDED') {
                    subscription.status = data.status;
                    subscription.canceled_at = new Date().toISOString();
                    if (!subscription.cancelation_reason)
                        subscription.cancelation_reason = 'Cancelada pelo sistema';
                    subscriptionRepository.save(subscription);
                    sendCancelationMessage();
                }
            }
            return subscription;
        });
    }
}
exports.default = SubscriptionStatusService;
//# sourceMappingURL=SubscriptionStatusService.js.map