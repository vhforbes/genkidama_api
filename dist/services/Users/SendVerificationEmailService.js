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
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = require("../../config/nodemailer");
const AppError_1 = __importDefault(require("../../errors/AppError"));
dotenv_1.default.config();
class SendVerificationEmailService {
    static execute({ email, token }) {
        return __awaiter(this, void 0, void 0, function* () {
            const verificationLink = `${process.env.BACKEND_URL}/users/verify/${token}`;
            try {
                const info = yield nodemailer_1.transporter.sendMail({
                    from: '"Genkidama" <admin@genkidama.me>',
                    to: email,
                    subject: 'Bem vindo a Genkidama!',
                    text: token,
                    html: `
        <h1>Seja bem vindo a Genkidama!</h1>
        <p>Favor confirme seu email no link abaixo</p>
        <a href="${verificationLink}">Verify email</a>`, // html body
                });
                return { info };
            }
            catch (error) {
                console.error(error);
                throw new AppError_1.default('Unable to send verification email');
            }
        });
    }
}
exports.default = SendVerificationEmailService;
//# sourceMappingURL=SendVerificationEmailService.js.map