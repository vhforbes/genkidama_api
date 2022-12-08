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
class SubscriptionStatusService {
    static execute({ userId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.default);
            const subscriptionRepository = data_source_1.AppDataSource.getRepository(Subscription_1.default);
            const user = yield userRepository.findOne({
                where: { id: userId },
            });
            if (!user)
                throw new AppError_1.default('User was not found');
            const subscription = yield subscriptionRepository.findOne({
                where: { id: user === null || user === void 0 ? void 0 : user.subscription_id },
            });
            if (!subscription) {
                return {
                    status: 'NO SUBSCRIPTION FOUND',
                };
            }
            return subscription;
        });
    }
}
exports.default = SubscriptionStatusService;
//# sourceMappingURL=SubscriptionStatusService.js.map