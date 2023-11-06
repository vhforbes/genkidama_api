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
const MentoriaForm_1 = __importDefault(require("../../models/MentoriaForm"));
class CreateMentoriaFormService {
    static execute({ name, email, phone_number, telegram_username, trading_time, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const mentoriaFormRepository = data_source_1.AppDataSource.getRepository(MentoriaForm_1.default);
            const alreadyFilled = yield mentoriaFormRepository.findOne({
                where: { email },
            });
            if (alreadyFilled) {
                throw new AppError_1.default('Você já preencheu esse formulário ');
            }
            const cleanPhoneNumber = phone_number
                .replace('-', '')
                .replace('(', '')
                .replace(')', '');
            const mentoriaForm = mentoriaFormRepository.create({
                name,
                email,
                phone_number: cleanPhoneNumber,
                telegram_username: telegram_username.trim(),
                trading_time,
            });
            try {
                const results = yield mentoriaFormRepository.save(mentoriaForm);
                return results;
            }
            catch (error) {
                console.error(error);
                throw new AppError_1.default('Não foi possivel enviar o fomrmulário');
            }
        });
    }
}
exports.default = CreateMentoriaFormService;
//# sourceMappingURL=CreateMentoriaFormService.js.map