"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAutenticated = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_1 = __importDefault(require("../config/auth"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const ensureAutenticated = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AppError_1.default('Token is missing');
    }
    const [, token] = authHeader.split(' ');
    try {
        const decodedToken = (0, jsonwebtoken_1.verify)(token, auth_1.default.jwt.secret);
        const { id, name } = decodedToken;
        req.user = {
            id,
            name,
        };
        return next();
    }
    catch (_a) {
        throw new AppError_1.default('Invalid JWT Token', 401);
    }
};
exports.ensureAutenticated = ensureAutenticated;
//# sourceMappingURL=ensureAuthenticated.js.map