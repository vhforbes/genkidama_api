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
const dotenv_1 = __importDefault(require("dotenv"));
require("reflect-metadata");
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const data_source_1 = require("./data-source");
const upload_1 = __importDefault(require("./config/upload"));
const AppError_1 = __importDefault(require("./errors/AppError"));
dotenv_1.default.config();
data_source_1.AppDataSource.initialize()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Data Source has been initialized!');
}))
    .catch(err => {
    console.error('Error during Data Source initialization:', err);
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/files', express_1.default.static(upload_1.default.tmpPath));
app.use(routes_1.default);
app.use((err, _req, res, _next) => {
    console.error(err);
    if (err instanceof AppError_1.default) {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }
    else {
        res.status(500).json({
            status: 'error',
            message: err.message,
        });
    }
});
const port = process.env.PORT || 3333;
app.listen(port, () => {
    console.log('Server started on port ', port);
});
