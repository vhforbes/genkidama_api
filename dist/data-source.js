"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const _1664455607246_postsTableUsersTable_1 = require("./migrations/1664455607246-postsTableUsersTable");
const _1668256084805_verifiedUserAttribute_1 = require("./migrations/1668256084805-verifiedUserAttribute");
const Post_1 = __importDefault(require("./models/Post"));
const Token_1 = __importDefault(require("./models/Token"));
const User_1 = __importDefault(require("./models/User"));
dotenv_1.default.config();
if (!process.env.DATABASE_URL) {
    console.log('NOT FOUND THE DATABASE ENV');
}
exports.AppDataSource = new typeorm_1.DataSource({
    url: process.env.DATABASE_URL,
    type: 'postgres',
    synchronize: true,
    logging: false,
    entities: [Post_1.default, User_1.default, Token_1.default],
    migrations: [
        _1664455607246_postsTableUsersTable_1.postsTableUsersTable1664455607246,
        _1668256084805_verifiedUserAttribute_1.verifiedUserAttribute1668256084805,
    ],
    subscribers: [],
    ssl: {
        rejectUnauthorized: false,
    },
});
