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
const axios_1 = __importDefault(require("axios"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const fiveMinutesAppart = (timestamp1, timestamp2) => {
    const diffInSeconds = Math.abs(timestamp1 - timestamp2);
    const fiveMinutesInSeconds = 5 * 60;
    return diffInSeconds >= fiveMinutesInSeconds;
};
let xdecowTime = 0;
let xdecowData = {};
class GetXdecowDataService {
    static execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const serverTime = new Date().getTime() / 1000; // Get in seconds
            if (fiveMinutesAppart(serverTime, xdecowTime)) {
                try {
                    console.log('MAKING XDECOW REQUEST');
                    const response = yield axios_1.default.get('https://xdecow.com/api/report/pvt/btc-summary/Psuleuf2ZAPqFvGRAWCM4hVmY3xj1dSb');
                    xdecowData = response.data;
                    xdecowTime = xdecowData.timestamp;
                    return xdecowData.data;
                }
                catch (error) {
                    throw new AppError_1.default('Could not get xdecow data');
                }
            }
            return xdecowData.data;
        });
    }
}
exports.default = GetXdecowDataService;
//# sourceMappingURL=GetXdecowDataService.js.map