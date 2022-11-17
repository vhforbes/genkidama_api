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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const PostsRepository_1 = __importDefault(require("../../repositories/PostsRepository"));
class GetPaginatedPostsService {
    static execute({ page, limit, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const response = yield PostsRepository_1.default.paginatedPosts(limit, startIndex);
            if (!response) {
                throw new AppError_1.default('Unable to make posts query');
            }
            const posts = response[0];
            const totalPosts = response[1];
            if (posts.length < 1) {
                throw new AppError_1.default('There are no more posts to be fetched');
            }
            const results = {
                posts,
                next: {},
                previous: {},
                totalPages: Math.ceil(totalPosts / limit),
            };
            // Next page number and check if the posts has ended
            if (endIndex > posts.length && page * limit < totalPosts) {
                results.next = {
                    page: page + 1,
                    limit,
                };
            }
            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    limit,
                };
            }
            return results;
        });
    }
}
exports.default = GetPaginatedPostsService;
