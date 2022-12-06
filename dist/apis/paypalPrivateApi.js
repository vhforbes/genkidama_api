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
const data_source_1 = require("../data-source");
const AppError_1 = __importDefault(require("../errors/AppError"));
const PayPalAccessToken_1 = __importDefault(require("../models/PayPalAccessToken"));
const GetPaypalAccessToken_1 = __importDefault(require("../services/Paypal/GetPaypalAccessToken"));
const paypalPrivateApi = axios_1.default.create({});
paypalPrivateApi.defaults.baseURL = 'https://api.sandbox.paypal.com/v1/';
paypalPrivateApi.interceptors.request.use((config) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const paypalAccessTokenRepository = data_source_1.AppDataSource.getRepository(PayPalAccessToken_1.default);
    const paypalAccessToken = yield paypalAccessTokenRepository.find();
    const token = (_a = paypalAccessToken[0]) === null || _a === void 0 ? void 0 : _a.paypal_access_token;
    if (token) {
        // eslint-disable-next-line no-param-reassign
        config.headers = {
            // ...config.headers,
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
    }
    return config;
}), error => () => new AppError_1.default(error.message));
paypalPrivateApi.interceptors.response.use(response => response, (error) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const config = error === null || error === void 0 ? void 0 : error.config;
    const paypalAccessToken = yield GetPaypalAccessToken_1.default.execute();
    if (((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.status) === (401 || 415) && !(config === null || config === void 0 ? void 0 : config.sent)) {
        config.sent = true;
        if (paypalAccessToken) {
            config.headers = Object.assign(Object.assign({}, config.headers), { 'content-type': 'application/json', Authorization: `Bearer ${paypalAccessToken}` });
        }
        return (0, axios_1.default)(config);
    }
    return Promise.reject(error);
}));
exports.default = paypalPrivateApi;
//# sourceMappingURL=paypalPrivateApi.js.map