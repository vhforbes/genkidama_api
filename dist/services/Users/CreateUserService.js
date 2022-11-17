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
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = require("bcryptjs");
const data_source_1 = require("../../data-source");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Token_1 = __importDefault(require("../../models/Token"));
const User_1 = __importDefault(require("../../models/User"));
class CreateUserService {
    static execute({ name, email, password, }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Transforma a data em um horario inicial, 9:15 => 9:00
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.default);
            const tokenRepository = data_source_1.AppDataSource.getRepository(Token_1.default);
            const userExists = yield userRepository.findOne({
                where: { email },
            });
            if (userExists) {
                throw new AppError_1.default('Email already in use');
            }
            const hashedPassword = yield (0, bcryptjs_1.hash)(password, 8);
            const user = userRepository.create({
                name,
                email,
                password: hashedPassword,
            });
            const createdUser = yield userRepository.save(user);
            // Create a token to to be used in email verification
            const verificationToken = tokenRepository.create({
                user_id: createdUser.id,
                token: crypto_1.default.randomBytes(16).toString('hex'),
            });
            const createdToken = yield tokenRepository.save(verificationToken);
            return { user: createdUser, token: createdToken.token };
        });
    }
}
exports.default = CreateUserService;
