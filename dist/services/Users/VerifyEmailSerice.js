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
const data_source_1 = require("../../data-source");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Token_1 = __importDefault(require("../../models/Token"));
const User_1 = __importDefault(require("../../models/User"));
class VerifyEmailSerice {
    static execute({ token }) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenRepository = data_source_1.AppDataSource.getRepository(Token_1.default);
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.default);
            const verificationToken = yield tokenRepository.findOne({
                where: { token },
            });
            if (!verificationToken) {
                throw new AppError_1.default('Invalid confirmation token');
            }
            const verifiedUser = yield userRepository.findOne({
                where: { id: verificationToken.user_id },
            });
            if (!verifiedUser) {
                throw new AppError_1.default('Unable to find user to verify email address');
            }
            verifiedUser.verified = true;
            yield userRepository.save(verifiedUser);
            yield tokenRepository.delete(verificationToken);
            return { success: true };
        });
    }
}
exports.default = VerifyEmailSerice;
