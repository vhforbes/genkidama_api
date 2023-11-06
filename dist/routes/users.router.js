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
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const upload_1 = __importDefault(require("../config/upload"));
const data_source_1 = require("../data-source");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const User_1 = __importDefault(require("../models/User"));
const CreateUserService_1 = __importDefault(require("../services/Users/CreateUserService"));
const RecoverPasswordService_1 = __importDefault(require("../services/Users/RecoverPasswordService"));
const SendPasswordResetLinkSerivce_1 = __importDefault(require("../services/Users/SendPasswordResetLinkSerivce"));
const UpdateUserAvatarService_1 = __importDefault(require("../services/Users/UpdateUserAvatarService"));
const UpdateUserService_1 = __importDefault(require("../services/Users/UpdateUserService"));
const VerifyEmailSerice_1 = __importDefault(require("../services/Users/VerifyEmailSerice"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const ensureAdmin_1 = require("../middlewares/ensureAdmin");
const SetUserMemberService_1 = __importDefault(require("../services/Users/SetUserMemberService"));
const ListUsersService_1 = __importDefault(require("../services/Users/ListUsersService"));
const UsersRepository_1 = __importDefault(require("../repositories/UsersRepository"));
const usersRouter = (0, express_1.Router)();
const upload = (0, multer_1.default)(upload_1.default);
dotenv_1.default.config();
usersRouter.get('/', ensureAuthenticated_1.ensureAutenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.default);
    if (!userId) {
        throw new AppError_1.default('No user ID provided');
    }
    const user = yield userRepository.findOne({
        where: {
            id: userId,
        },
        relations: { subscription: true, tradeOperations: true },
    });
    // @ts-expect-error
    delete user.password;
    return res.json({ user });
}));
usersRouter.get('/id/:id', ensureAuthenticated_1.ensureAutenticated, ensureAdmin_1.ensureAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usersRepository = UsersRepository_1.default;
    const { id } = req.params;
    const user = yield usersRepository.findOne({
        where: {
            id,
        },
        relations: ['subscription'],
    });
    if (!user) {
        throw new AppError_1.default('Could not find user');
    }
    return res.json(user);
}));
usersRouter.get('/list', ensureAuthenticated_1.ensureAutenticated, ensureAdmin_1.ensureAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usersList = yield ListUsersService_1.default.execute();
    return res.json(usersList);
}));
usersRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, exchangeUID, exchange } = req.body;
    const { user } = yield CreateUserService_1.default.execute({
        name,
        email,
        password,
        exchangeUID,
        exchange,
    });
    // @ts-expect-error
    delete user.password;
    return res.json({ user });
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
usersRouter.patch('/set-member', ensureAuthenticated_1.ensureAutenticated, ensureAdmin_1.ensureAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, isMember } = req.body;
    const user = yield SetUserMemberService_1.default.execute({
        email,
        isMember,
    });
    res.json(user);
}));
usersRouter.put('/update/:id', ensureAuthenticated_1.ensureAutenticated, ensureAdmin_1.ensureAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield UpdateUserService_1.default.execute(req.body);
    res.send(updatedUser);
}));
usersRouter.put('/updateFromToken', ensureAuthenticated_1.ensureAutenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, exchangeUID, exchange } = req.body;
    const updatedUser = yield UpdateUserService_1.default.execute({
        id: req.user.id,
        name,
        exchangeUID,
        exchange,
    });
    res.send(updatedUser);
}));
usersRouter.get('/verify/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const response = yield VerifyEmailSerice_1.default.execute({ token });
    if (response.success) {
        res.redirect(`${process.env.FRONTEND_URL}/sign-in`);
    }
}));
usersRouter.post('/recover', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    yield SendPasswordResetLinkSerivce_1.default.execute({ email });
    res.send({ ok: 'ok' });
}));
usersRouter.put('/recover', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.body.token;
    const newPassword = req.body.newPassword;
    const response = yield RecoverPasswordService_1.default.execute({ token, newPassword });
    // @ts-expect-error
    delete response.user.password;
    res.send(response);
}));
exports.default = usersRouter;
//# sourceMappingURL=users.router.js.map