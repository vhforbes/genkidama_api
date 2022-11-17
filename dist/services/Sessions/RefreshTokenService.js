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
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_1 = __importDefault(require("../../config/auth"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
class RefreshTokenService {
    static execute({ refreshToken }) {
        return __awaiter(this, void 0, void 0, function* () {
            const RefreshTokenConfig = auth_1.default.refreshToken;
            const AuthTokenConfig = auth_1.default.jwt;
            try {
                const decoded = (0, jsonwebtoken_1.verify)(refreshToken, RefreshTokenConfig.secret);
                let newToken = (0, jsonwebtoken_1.sign)({ id: decoded.id, name: decoded.name }, AuthTokenConfig.secret, {
                    expiresIn: AuthTokenConfig.expiresIn,
                });
                return { token: newToken };
            }
            catch (_a) {
                throw new AppError_1.default('Invalid refresh token');
            }
        });
    }
}
exports.default = RefreshTokenService;
