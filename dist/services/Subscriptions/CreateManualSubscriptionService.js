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
/* eslint-disable prettier/prettier */
const data_source_1 = require("../../data-source");
const subscriptionTypes_1 = require("../../enums/subscriptionTypes");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Subscription_1 = __importDefault(require("../../models/Subscription"));
const User_1 = __importDefault(require("../../models/User"));
class CreateManualSubscriptionService {
    static execute({ email, type, current_period_end, }) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.default);
            const subscriptionRepository = data_source_1.AppDataSource.getRepository(Subscription_1.default);
            const user = yield userRepository.findOne({
                where: { email },
                relations: ['subscription'],
            });
            if (!user) {
                throw new AppError_1.default('User not found');
            }
            // CHECKS IF USER HAS A ACTIVE SUBSCRIPTION
            if (((_a = user === null || user === void 0 ? void 0 : user.subscription) === null || _a === void 0 ? void 0 : _a.status) === 'ACTIVE') {
                throw new AppError_1.default('User already has a active subscription, edit it instead');
            }
            const isValidSubscriptionType = () => {
                return Object.values(subscriptionTypes_1.subscriptionTypes).includes(type);
            };
            if (!isValidSubscriptionType()) {
                throw new AppError_1.default('Subscription type is not valid');
            }
            if ((type !== subscriptionTypes_1.subscriptionTypes.vip ||
                type !== subscriptionTypes_1.subscriptionTypes.betaTester) &&
                !current_period_end) {
                throw new AppError_1.default('You must provide a End Date for this subscription');
            }
            const dateNow = new Date().toISOString().split('.')[0] + 'Z';
            const adjustedEnddate = type === 'VIP' ? '' : current_period_end;
            const subscription = subscriptionRepository.create({
                user_id: user.id,
                email: user.email,
                status: 'ACTIVE',
                type,
                current_period_start: dateNow,
                current_period_end: adjustedEnddate,
            });
            const createdSubscription = yield subscriptionRepository.save(subscription);
            user.subscription = createdSubscription;
            yield userRepository.save(user);
            return subscription;
        });
    }
}
exports.default = CreateManualSubscriptionService;
//# sourceMappingURL=CreateManualSubscriptionService.js.map