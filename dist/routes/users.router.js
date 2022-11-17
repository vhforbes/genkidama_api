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
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const CreateUserService_1 = __importDefault(require("../services/Users/CreateUserService"));
const SendVerificationEmailService_1 = __importDefault(require("../services/Users/SendVerificationEmailService"));
const UpdateUserAvatarService_1 = __importDefault(require("../services/Users/UpdateUserAvatarService"));
const VerifyEmailSerice_1 = __importDefault(require("../services/Users/VerifyEmailSerice"));
const usersRouter = (0, express_1.Router)();
const upload = (0, multer_1.default)(upload_1.default);
usersRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const { user, token } = yield CreateUserService_1.default.execute({
        name,
        email,
        password,
    });
    // @ts-expect-error
    delete user.password;
    // -------- Send verification email --------
    yield SendVerificationEmailService_1.default.execute({ token });
    return res.json(user);
}));
usersRouter.patch('/avatar', ensureAuthenticated_1.ensureAutenticated, upload.single('avatar'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        throw new Error('You must upload a file');
    }
    const user = yield UpdateUserAvatarService_1.default.execute({
        user_id: req.user.id,
        avatar: file.filename,
    });
    // @ts-expect-error
    delete user.password;
    res.json(user);
}));
usersRouter.get('/verify/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const response = yield VerifyEmailSerice_1.default.execute({ token });
    if (response.success) {
        res.redirect('http://google.com');
    }
}));
exports.default = usersRouter;
