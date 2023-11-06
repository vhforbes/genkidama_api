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
class UpdateSubscriptionService {
    static execute({ id, status, paypal_subscription_id, type, cancelation_reason, current_period_end, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscriptionRepository = data_source_1.AppDataSource.getRepository(Subscription_1.default);
            const subscriptionToUpdate = yield subscriptionRepository.findOne({
                where: { id },
            });
            if (!subscriptionToUpdate) {
                throw new AppError_1.default('Subscription was not found');
            }
            // ---- SUBSCRPTION CANCELADA MANUALMENTE ----
            if (subscriptionToUpdate.status === 'ACTIVE' && status === 'CANCELED') {
                subscriptionToUpdate.current_period_end = new Date().toISOString();
            }
            const adjustedEnddate = type === 'VIP' ? '' : current_period_end;
            subscriptionToUpdate.status = status;
            subscriptionToUpdate.paypal_subscription_id = paypal_subscription_id;
            subscriptionToUpdate.type = type;
            subscriptionToUpdate.cancelation_reason = cancelation_reason;
            subscriptionToUpdate.current_period_end = adjustedEnddate;
            subscriptionRepository.save(subscriptionToUpdate);
            return subscriptionToUpdate;
        });
    }
}
exports.default = UpdateSubscriptionService;
//# sourceMappingURL=UpdateSubscriptionService.js.map