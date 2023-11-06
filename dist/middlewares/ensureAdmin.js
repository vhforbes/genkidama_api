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
exports.ensureAdmin = void 0;
const data_source_1 = require("../data-source");
const AppError_1 = __importDefault(require("../errors/AppError"));
const User_1 = __importDefault(require("../models/User"));
const ensureAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const usersRepository = data_source_1.AppDataSource.getRepository(User_1.default);
    const user = yield usersRepository.findOne({
        where: { id: req.user.id },
    });
    if (!user) {
        throw new AppError_1.default('User not found');
    }
    if (user.role !== 'ADMIN') {
        throw new AppError_1.default('You need to be a admin');
    }
    return next();
});
exports.ensureAdmin = ensureAdmin;
//# sourceMappingURL=ensureAdmin.js.map