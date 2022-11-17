"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const tmpPath = path_1.default.resolve(__dirname, '..', '..', 'tmp');
exports.default = {
    tmpPath,
    storage: multer_1.default.diskStorage({
        destination: (req, res, callback) => {
            callback(null, path_1.default.resolve(__dirname, '..', '..', 'tmp'));
        },
        filename: (req, file, callback) => {
            const uniqueSuffix = `${Date.now() + '-' + Math.round(Math.random() * 1e9) + file.originalname}`;
            callback(null, file.fieldname + '-' + uniqueSuffix);
        },
    }),
};
