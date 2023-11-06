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
const upload_1 = __importDefault(require("../../config/upload"));
const initializeBot_1 = require("../../bot/initializeBot");
const UsersRepository_1 = __importDefault(require("../../repositories/UsersRepository"));
class BroadcastImageToMembersService {
    static execute({ fileName, }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Remove if existing avatar file.
            const filePath = path_1.default.join(upload_1.default.tmpPath, fileName);
            const members = yield UsersRepository_1.default.memberList();
            members.forEach((member) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield initializeBot_1.bot.sendPhoto(member.telegramId, fs_1.default.createReadStream(filePath), {}, { contentType: 'image/*' });
                }
                catch (error) {
                    console.error(error);
                    console.error(`Cloud not send image to ${member.email}`);
                }
            }));
            return { status: 'ok' };
        });
    }
}
exports.default = BroadcastImageToMembersService;
//# sourceMappingURL=broadcastImageToMembersService.js.map