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
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const data_source_1 = require("../../data-source");
const auth_1 = __importDefault(require("../../config/auth"));
const User_1 = __importDefault(require("../../models/User"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
class CreateSessionService {
    static execute({ email, password }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.default);
            const user = yield userRepository.findOne({
                where: { email },
            });
            if (!user) {
                throw new AppError_1.default('Invalid user or password', 401);
            }
            const validPassword = yield (0, bcryptjs_1.compare)(password, user.password);
            if (!validPassword) {
                throw new AppError_1.default('Invalid user or password', 401);
            }
            const RefreshTokenConfig = auth_1.default.refreshToken;
            let refreshToken = (0, jsonwebtoken_1.sign)({ id: user.id, name: user.name }, RefreshTokenConfig.secret, {
                expiresIn: RefreshTokenConfig.expiresIn,
            });
            const AuthTokenConfig = auth_1.default.jwt;
            let token = (0, jsonwebtoken_1.sign)({ id: user.id, name: user.name }, AuthTokenConfig.secret, {
                expiresIn: AuthTokenConfig.expiresIn,
            });
            return { user, token, refreshToken };
        });
    }
}
exports.default = CreateSessionService;
