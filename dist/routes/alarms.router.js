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
const sendAlarmService_1 = __importDefault(require("../services/Alarms/sendAlarmService"));
const alarmsRouter = (0, express_1.Router)();
alarmsRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requestBody = req.body;
    sendAlarmService_1.default.execute(requestBody);
    return res.json({ ok: 'ok' });
}));
exports.default = alarmsRouter;
//# sourceMappingURL=alarms.router.js.map