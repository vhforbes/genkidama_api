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
const multer_1 = __importDefault(require("multer"));
const upload_1 = __importDefault(require("../config/upload"));
const ensureAdmin_1 = require("../middlewares/ensureAdmin");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const sendMessageToGroup_1 = __importDefault(require("../bot/utils/sendMessageToGroup"));
const broadcastImageToGroupService_1 = __importDefault(require("../services/MestreKame/broadcastImageToGroupService"));
const broadcastImageToMembersService_1 = __importDefault(require("../services/MestreKame/broadcastImageToMembersService"));
const sendMessageToUsers_1 = __importDefault(require("../bot/utils/sendMessageToUsers"));
const UsersRepository_1 = __importDefault(require("../repositories/UsersRepository"));
const typeorm_1 = require("typeorm");
// import storageConfig from '../config/multer';
// import { bot } from '../bot/initializeBot';
const mestreKameRouter = (0, express_1.Router)();
const upload = (0, multer_1.default)(upload_1.default);
mestreKameRouter.post('/broadcastToGroup', ensureAuthenticated_1.ensureAutenticated, ensureAdmin_1.ensureAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.body;
    yield (0, sendMessageToGroup_1.default)(message);
    return res.json('message sent');
}));
mestreKameRouter.post('/broadcastToMembers', ensureAuthenticated_1.ensureAutenticated, ensureAdmin_1.ensureAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.body;
    const users = yield UsersRepository_1.default.memberList();
    yield (0, sendMessageToUsers_1.default)({
        users,
        messageHtml: message,
    });
    return res.status(200).send('OK');
}));
mestreKameRouter.post('/broadcastToAll', ensureAuthenticated_1.ensureAutenticated, ensureAdmin_1.ensureAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.body;
    const users = yield UsersRepository_1.default.find({
        where: {
            telegramId: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
        },
    });
    yield (0, sendMessageToUsers_1.default)({
        users,
        messageHtml: message,
    });
    return res.status(200).send('OK');
}));
mestreKameRouter.post('/broadcastImageToGroup', ensureAuthenticated_1.ensureAutenticated, ensureAdmin_1.ensureAdmin, upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        throw new Error('You must upload a file');
    }
    broadcastImageToGroupService_1.default.execute({ fileName: file.filename });
    res.json({ status: 'ok' });
}));
mestreKameRouter.post('/broadcastImageToAll', ensureAuthenticated_1.ensureAutenticated, ensureAdmin_1.ensureAdmin, upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        throw new Error('You must upload a file');
    }
    broadcastImageToGroupService_1.default.execute({ fileName: file.filename });
    res.json({ status: 'ok' });
}));
mestreKameRouter.post('/broadcastImageToMembers', ensureAuthenticated_1.ensureAutenticated, ensureAdmin_1.ensureAdmin, upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        throw new Error('You must upload a file');
    }
    broadcastImageToMembersService_1.default.execute({ fileName: file.filename });
    res.json({ status: 'ok' });
}));
exports.default = mestreKameRouter;
//# sourceMappingURL=mestreKame.router.js.map