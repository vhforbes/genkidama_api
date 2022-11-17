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
const AppError_1 = __importDefault(require("../errors/AppError"));
const CreateSessionService_1 = __importDefault(require("../services/Sessions/CreateSessionService"));
const RefreshTokenService_1 = __importDefault(require("../services/Sessions/RefreshTokenService"));
const sessionsRouter = (0, express_1.Router)();
sessionsRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const { user, token, refreshToken } = yield CreateSessionService_1.default.execute({
        email,
        password,
    });
    // @ts-expect-error
    delete user.password;
    return res.json({ user, token, refreshToken });
}));
sessionsRouter.post('/refresh', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default('RefreshToken is missing');
    }
    const newToken = yield RefreshTokenService_1.default.execute({ refreshToken });
    return res.json(newToken);
}));
exports.default = sessionsRouter;
