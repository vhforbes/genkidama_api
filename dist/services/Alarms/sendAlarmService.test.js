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
const sendAlarmToUsers_1 = __importDefault(require("../../bot/utils/sendAlarmToUsers"));
const UsersRepository_1 = __importDefault(require("../../repositories/UsersRepository"));
const sendAlarmService_1 = __importDefault(require("./sendAlarmService"));
jest.mock('../../bot/utils/sendAlarmToUsers');
jest.mock('../../repositories/UsersRepository');
describe('SendAlarmService', () => {
    it('should send alarm to users with active alarms and return "ok"', () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const alarmRequest = {
            ticker: 'BTCUSD',
            message: 'Alarm message',
        };
        const users = [
            { id: '1', name: 'John' },
            { id: '2', name: 'Jane' },
        ];
        UsersRepository_1.default.membersWithActiveAlarms.mockResolvedValue(users);
        sendAlarmToUsers_1.default.mockResolvedValue(undefined);
        // Act
        const result = yield sendAlarmService_1.default.execute(alarmRequest);
        // Assert
        expect(result).toEqual('ok');
        expect(UsersRepository_1.default.membersWithActiveAlarms).toHaveBeenCalled();
        expect(sendAlarmToUsers_1.default).toHaveBeenCalledWith({
            users,
            ticker: 'BTC',
            message: 'Alarm message',
            bitgetLink: 'https://www.bitget.com/futures/usdt/BTCUSDT',
            bybitLink: 'https://www.bybit.com/trade/usdt/BTCUSDT',
        });
        // await stopBot(); // stop the bot after all tests are done
    }));
});
//# sourceMappingURL=sendAlarmService.test.js.map