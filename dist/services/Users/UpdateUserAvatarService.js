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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const data_source_1 = require("../../data-source");
const upload_1 = __importDefault(require("../../config/upload"));
const User_1 = __importDefault(require("../../models/User"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
class UpdateUserAvatarService {
    static execute({ user_id, avatar }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.default);
            const user = yield userRepository.findOne({
                where: { id: user_id },
            });
            if (!user) {
                throw new AppError_1.default('Invalid user to update avatar');
            }
            // Remove if existing avatar file.
            if (user.avatar) {
                const userAvatarFilePath = path_1.default.join(upload_1.default.tmpPath, user.avatar);
                const avatarExists = yield fs_1.default.promises.stat(userAvatarFilePath);
                if (avatarExists) {
                    yield fs_1.default.promises.unlink(userAvatarFilePath);
                }
            }
            user.avatar = avatar;
            userRepository.save(user);
            return user;
        });
    }
}
exports.default = UpdateUserAvatarService;
//# sourceMappingURL=UpdateUserAvatarService.js.map