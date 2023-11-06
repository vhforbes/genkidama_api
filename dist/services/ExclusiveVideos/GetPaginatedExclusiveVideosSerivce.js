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
const ExclusiveVideosRepository_1 = __importDefault(require("../../repositories/ExclusiveVideosRepository"));
const responseToCamel_1 = require("../../utils/responseToCamel");
class GetPaginatedExclusiveVideosService {
    static execute({ page, limit, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const response = yield ExclusiveVideosRepository_1.default.paginatedExclusiveVideos(limit, startIndex);
            if (!response) {
                throw new AppError_1.default('Unable to make exclusiveVideos query');
            }
            const exclusiveVideos = (0, responseToCamel_1.arrayToCamel)(response[0]);
            const totalPosts = response[1];
            const results = {
                exclusiveVideos,
                next: {},
                previous: {},
                totalPages: Math.ceil(totalPosts / limit),
            };
            // Next page number and check if the posts has ended
            if (endIndex > exclusiveVideos.length && page * limit < totalPosts) {
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
exports.default = GetPaginatedExclusiveVideosService;
//# sourceMappingURL=GetPaginatedExclusiveVideosSerivce.js.map