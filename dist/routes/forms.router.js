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
const express_1 = require("express");
const CreateMentoriaFormService_1 = __importDefault(require("../services/Forms/CreateMentoriaFormService"));
const alertLiveStatus_1 = require("../bot/livesBot/alertLiveStatus");
const StartLiveService_1 = __importDefault(require("../services/Forms/StartLiveService"));
const formsRouter = (0, express_1.Router)();
formsRouter.post('/mentoria', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phoneNumber, telegramName, tradingTime } = req.body;
    const response = yield CreateMentoriaFormService_1.default.execute({
        name: name,
        email: email,
        phone_number: phoneNumber,
        telegram_username: telegramName,
        trading_time: tradingTime,
    });
    return res.json(response);
}));
formsRouter.post('/startLive', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, alertLiveStatus_1.alertLiveStart)();
    yield StartLiveService_1.default.execute({ live: true });
    return res.json({ status: 'live started' });
}));
formsRouter.post('/closeLive', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, alertLiveStatus_1.alertLiveClose)();
    yield StartLiveService_1.default.execute({ live: false });
    return res.json({ status: 'live ended' });
}));
exports.default = formsRouter;
//# sourceMappingURL=forms.router.js.map