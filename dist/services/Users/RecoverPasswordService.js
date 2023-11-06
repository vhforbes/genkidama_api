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
// import crypto from 'crypto';
const bcryptjs_1 = require("bcryptjs");
const data_source_1 = require("../../data-source");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const User_1 = __importDefault(require("../../models/User"));
const jsonwebtoken_1 = require("jsonwebtoken");
const resetPassword_1 = __importDefault(require("../../config/resetPassword"));
// EMAIL SERVICE TO-BE IMPLEMENTED WHEN EMAIL ONLINE
class UpdatePasswordService {
    static execute({ token, newPassword, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.default);
            const decodedToken = (0, jsonwebtoken_1.verify)(token, resetPassword_1.default.jwt.secret);
            const { email } = decodedToken;
            const user = yield userRepository.findOne({
                where: { email },
            });
            if (!user) {
                throw new AppError_1.default('User dont exist');
            }
            const hashedPassword = yield (0, bcryptjs_1.hash)(newPassword, 8);
            // MAY NOT WORK BECAUSE OF THE SELECT
            user.password = hashedPassword;
            const updatedUser = yield userRepository.save(user);
            return { user: updatedUser };
        });
    }
}
exports.default = UpdatePasswordService;
//# sourceMappingURL=RecoverPasswordService.js.map