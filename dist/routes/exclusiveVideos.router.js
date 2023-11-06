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
/* eslint-disable @typescript-eslint/naming-convention */
const express_1 = require("express");
const AppError_1 = __importDefault(require("../errors/AppError"));
const ensureAdmin_1 = require("../middlewares/ensureAdmin");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const ExclusiveVideosRepository_1 = __importDefault(require("../repositories/ExclusiveVideosRepository"));
const CreateExclusiveVideoService_1 = __importDefault(require("../services/ExclusiveVideos/CreateExclusiveVideoService"));
const GetPaginatedExclusiveVideosSerivce_1 = __importDefault(require("../services/ExclusiveVideos/GetPaginatedExclusiveVideosSerivce"));
const UpdateExclusiveVideoService_1 = __importDefault(require("../services/ExclusiveVideos/UpdateExclusiveVideoService"));
const responseToCamel_1 = require("../utils/responseToCamel");
const exclusiveVideoRouter = (0, express_1.Router)();
exclusiveVideoRouter.use(ensureAuthenticated_1.ensureAutenticated);
exclusiveVideoRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // If there is no query params return all posts
    if (!req.query.page || !req.query.limit) {
        const response = yield ExclusiveVideosRepository_1.default.find();
        const camelizedRes = (0, responseToCamel_1.arrayToCamel)(response);
        res.json(camelizedRes);
    }
    if (req.query.page && req.query.limit) {
        const page = parseInt(req.query.page, 10);
        const limit = parseInt(req.query.limit, 10);
        const response = yield GetPaginatedExclusiveVideosSerivce_1.default.execute({ page, limit });
        res.json(response);
    }
}));
exclusiveVideoRouter.post('/', ensureAdmin_1.ensureAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exclusiveVideo = req.body;
    exclusiveVideo.authorId = req.user.id;
    const result = yield CreateExclusiveVideoService_1.default.execute(exclusiveVideo);
    return res.json((0, responseToCamel_1.objToCamel)(result));
}));
exclusiveVideoRouter.put('/', ensureAdmin_1.ensureAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, title, content, image, videoLink } = req.body;
    const result = yield UpdateExclusiveVideoService_1.default.execute({
        id,
        title,
        content,
        image,
        video_link: videoLink,
    });
    return res.json((0, responseToCamel_1.objToCamel)(result));
}));
exclusiveVideoRouter.delete('/:id', ensureAdmin_1.ensureAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const exclusiveVideosRepository = ExclusiveVideosRepository_1.default;
    const { id } = req.params;
    const exclusiveVideo = yield exclusiveVideosRepository.findOne({
        where: {
            id,
        },
    });
    if (!exclusiveVideo) {
        throw new AppError_1.default('Could not find exclusive video to delete');
    }
    const result = yield exclusiveVideosRepository.remove(exclusiveVideo);
    return res.json((0, responseToCamel_1.objToCamel)(result));
}));
exports.default = exclusiveVideoRouter;
//# sourceMappingURL=exclusiveVideos.router.js.map