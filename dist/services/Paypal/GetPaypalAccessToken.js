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
const dotenv_1 = __importDefault(require("dotenv"));
const data_source_1 = require("../../data-source");
const PayPalAccessToken_1 = __importDefault(require("../../models/PayPalAccessToken"));
dotenv_1.default.config();
const paypalTokenApi = axios_1.default.create({});
class GetPaypalAccessToken {
    static execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const paypalAccessTokenRepository = data_source_1.AppDataSource.getRepository(PayPalAccessToken_1.default);
            const paypalAccessToken = yield paypalAccessTokenRepository.find();
            if (paypalAccessToken[0]) {
                paypalAccessTokenRepository.delete(paypalAccessToken[0]);
            }
            const response = yield paypalTokenApi({
                url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
                method: 'post',
                headers: {
                    Accept: 'application/json',
                    'Accept-Language': 'en_US',
                    'content-type': 'application/x-www-form-urlencoded',
                },
                auth: {
                    username: process.env.PAYPAL_USERNAME,
                    password: process.env.PAYPAL_PASSWORD,
                },
                params: {
                    grant_type: 'client_credentials',
                },
            });
            const paypalToken = response.data.access_token;
            const createdPaypalAccessToken = paypalAccessTokenRepository.create({
                paypal_access_token: paypalToken,
            });
            yield paypalAccessTokenRepository.save(createdPaypalAccessToken);
            return paypalToken;
        });
    }
}
exports.default = GetPaypalAccessToken;
//# sourceMappingURL=GetPaypalAccessToken.js.map