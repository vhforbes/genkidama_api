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
const typeorm_1 = require("typeorm");
const sendMessageToGroup_1 = __importDefault(require("../../bot/utils/sendMessageToGroup"));
const sendMessageToUsers_1 = __importDefault(require("../../bot/utils/sendMessageToUsers"));
const data_source_1 = require("../../data-source");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const User_1 = __importDefault(require("../../models/User"));
const ExclusiveVideosRepository_1 = __importDefault(require("../../repositories/ExclusiveVideosRepository"));
const UsersRepository_1 = __importDefault(require("../../repositories/UsersRepository"));
class CreateExclusiveVideoService {
    static execute(exclusiveVideo) {
        return __awaiter(this, void 0, void 0, function* () {
            const exclusiveVideosRepository = ExclusiveVideosRepository_1.default;
            const usersRepository = data_source_1.AppDataSource.getRepository(User_1.default);
            const { authorId, content, image, title, videoLink } = exclusiveVideo;
            const user = yield usersRepository.findOne({
                where: { id: authorId },
            });
            if (!user) {
                throw new AppError_1.default('Unable to create post: User not found');
            }
            const newExclusiveVideo = exclusiveVideosRepository.create({
                author_id: authorId,
                title,
                content,
                image,
                video_link: videoLink,
            });
            const results = yield exclusiveVideosRepository.save(newExclusiveVideo);
            // Send to users - bot
            const users = yield UsersRepository_1.default.find({
                where: {
                    telegramId: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
                },
            });
            const messageHtml = `Temos um novo vídeo.
<a href="www.genkidama.me">Entre na plataforma e confira!</a>`;
            (0, sendMessageToGroup_1.default)(messageHtml);
            (0, sendMessageToUsers_1.default)({ users, messageHtml });
            return results;
        });
    }
}
exports.default = CreateExclusiveVideoService;
//# sourceMappingURL=CreateExclusiveVideoService.js.map