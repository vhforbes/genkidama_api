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
const express_1 = require("express");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const PostsRepository_1 = __importDefault(require("../repositories/PostsRepository"));
const CreatePostService_1 = __importDefault(require("../services/Posts/CreatePostService"));
const GetPaginatedPostsSerivce_1 = __importDefault(require("../services/Posts/GetPaginatedPostsSerivce"));
const postsRouter = (0, express_1.Router)();
postsRouter.use(ensureAuthenticated_1.ensureAutenticated);
postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // If there is no query params return all posts
    if (!req.query.page || !req.query.limit) {
        const response = yield PostsRepository_1.default.find();
        res.json({ response });
    }
    if (req.query.page && req.query.limit) {
        const page = parseInt(req.query.page, 10);
        const limit = parseInt(req.query.limit, 10);
        const response = yield GetPaginatedPostsSerivce_1.default.execute({ page, limit });
        res.json(response);
    }
}));
postsRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorId, title, content, image, videoLink } = req.body;
    const post = yield CreatePostService_1.default.execute({
        author_id: authorId,
        title,
        content,
        image,
        video_link: videoLink,
    });
    return res.json(post);
}));
exports.default = postsRouter;
