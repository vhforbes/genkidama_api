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
const AppError_1 = __importDefault(require("../../errors/AppError"));
const initializeBot_1 = require("../../bot/initializeBot");
const groupId = process.env.GROUP_ID;
// process.env.NTBA_FIX_350 = 1;
class BroadcastImageToGroupService {
    static execute({ fileName, }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Remove if existing avatar file.
            const filePath = path_1.default.join(upload_1.default.tmpPath, fileName);
            try {
                yield initializeBot_1.bot.sendPhoto(groupId, fs_1.default.createReadStream(filePath), {}, { contentType: 'image/*' });
                return { status: 'ok' };
            }
            catch (error) {
                throw new AppError_1.default('Cloud not send message');
            }
        });
    }
}
exports.default = BroadcastImageToGroupService;
//# sourceMappingURL=broadcastImageToGroupService.js.map