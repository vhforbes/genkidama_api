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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const sendAlarmToUsers_1 = __importDefault(require("../../bot/utils/sendAlarmToUsers"));
const UsersRepository_1 = __importDefault(require("../../repositories/UsersRepository"));
class SendAlarmService {
    static execute({ ticker, message, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield UsersRepository_1.default.membersWithActiveAlarms();
            if (!ticker) {
                throw new AppError_1.default('No ticker provided.');
            }
            const sanitizedTicker = ticker.replace(/USD.*$/, '');
            const bitgetLink = `https://www.bitget.com/futures/usdt/${sanitizedTicker}USDT`;
            const bybitLink = `https://www.bybit.com/trade/usdt/${sanitizedTicker}USDT`;
            yield (0, sendAlarmToUsers_1.default)({
                users,
                ticker: sanitizedTicker,
                message,
                bitgetLink,
                bybitLink,
            });
            return 'ok';
        });
    }
}
exports.default = SendAlarmService;
//# sourceMappingURL=sendAlarmService.js.map