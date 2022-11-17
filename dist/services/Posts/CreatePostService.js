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
const Post_1 = __importDefault(require("../../models/Post"));
class CreatePostService {
    static execute({ title, author_id, content, image, video_link, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const postsRepository = data_source_1.AppDataSource.getRepository(Post_1.default);
            const post = postsRepository.create({
                author_id: author_id,
                title,
                content,
                image,
                video_link,
            });
            const results = yield postsRepository.save(post);
            return results;
        });
    }
}
exports.default = CreatePostService;
