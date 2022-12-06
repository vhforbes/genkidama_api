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
const nodemailer_1 = __importDefault(require("nodemailer"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
class SendVerificationEmailService {
    static execute({ token }) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = nodemailer_1.default.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'tyra.gleichner35@ethereal.email',
                    pass: '2xc9RdVNyajgzEm8Pz',
                },
            });
            const verificationLink = `http://localhost:3333/users/verify/${token}`;
            try {
                const info = yield transporter.sendMail({
                    from: '"Fred Foo 👻" <foo@example.com>',
                    to: 'vhforbes@gmail.com>',
                    subject: 'Hello ✔',
                    text: token,
                    html: `<a href="${verificationLink}">Verify email</a>`, // html body
                });
                return { info };
            }
            catch (error) {
                throw new AppError_1.default('Unable to send verification email');
            }
        });
    }
}
exports.default = SendVerificationEmailService;
//# sourceMappingURL=SendVerificationEmailService.js.map