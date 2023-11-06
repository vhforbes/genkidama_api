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
const crypto_1 = __importDefault(require("crypto"));
const data_source_1 = require("../../data-source");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const SendVerificationEmailService_1 = __importDefault(require("./SendVerificationEmailService"));
const ConfirmEmailToken_1 = __importDefault(require("../../models/ConfirmEmailToken"));
const User_1 = __importDefault(require("../../models/User"));
const BitgetAssociatedUids_1 = __importDefault(require("../../models/BitgetAssociatedUids"));
const roles_1 = require("../../enums/roles");
// EMAIL SERVICE TO-BE IMPLEMENTED WHEN EMAIL ONLINE
class CreateUserService {
    static execute({ name, email, password, exchangeUID, exchange, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.default);
            const bitgetRepository = data_source_1.AppDataSource.getRepository(BitgetAssociatedUids_1.default);
            const lowerCaseEmail = email.toLowerCase();
            const confirmEmailTokenRepository = data_source_1.AppDataSource.getRepository(ConfirmEmailToken_1.default);
            const userExists = yield userRepository.findOne({
                where: { email: lowerCaseEmail },
            });
            if (userExists) {
                throw new AppError_1.default('Email already in use');
            }
            const hashedPassword = yield (0, bcryptjs_1.hash)(password, 8);
            let hasBitgetAccount = null;
            if (exchangeUID) {
                // REFACTOR A HAS EXCHANGE ACCOUNT TO CHECK BOTH THE EXCHANGES
                hasBitgetAccount = yield bitgetRepository.findOne({
                    where: { BitgetUID: exchangeUID },
                });
            }
            const user = userRepository.create({
                name,
                email: lowerCaseEmail,
                password: hashedPassword,
                exchangeUID,
                role: hasBitgetAccount ? roles_1.roles.bitget : '',
                exchange,
                // eslint-disable-next-line no-unneeded-ternary
                exchangePartner: hasBitgetAccount ? true : false,
            });
            // Send verification email
            const createdUser = yield userRepository.save(user);
            const emailVerificationToken = confirmEmailTokenRepository.create({
                user_id: createdUser.id,
                token: crypto_1.default.randomBytes(16).toString('hex'),
            });
            yield SendVerificationEmailService_1.default.execute({
                email,
                token: emailVerificationToken.token,
            });
            yield confirmEmailTokenRepository.save(emailVerificationToken);
            return { user: createdUser };
        });
    }
}
exports.default = CreateUserService;
//# sourceMappingURL=CreateUserService.js.map