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
const UsersRepository_1 = __importDefault(require("../../repositories/UsersRepository"));
const SubscriptionStatusService_1 = __importDefault(require("./SubscriptionStatusService"));
class CheckAllSubs {
    static execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const members = yield UsersRepository_1.default.memberList();
            members.forEach((member) => __awaiter(this, void 0, void 0, function* () {
                yield SubscriptionStatusService_1.default.execute({ userId: member.id });
            }));
            return { status: 'all checked' };
        });
    }
}
exports.default = CheckAllSubs;
//# sourceMappingURL=CheckAllSubs.js.map