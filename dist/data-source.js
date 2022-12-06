"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const typeorm_1 = require("typeorm");
const _1669742463695_emptyMigration_1 = require("./migrations/1669742463695-emptyMigration");
const Post_1 = __importDefault(require("./models/Post"));
const Subscription_1 = __importDefault(require("./models/Subscription"));
const User_1 = __importDefault(require("./models/User"));
const ConfirmEmailToken_1 = __importDefault(require("./models/ConfirmEmailToken"));
const PayPalAccessToken_1 = __importDefault(require("./models/PayPalAccessToken"));
dotenv_1.default.config();
const enviroment = process.env.ENVIROMENT;
exports.AppDataSource = new typeorm_1.DataSource({
    url: process.env.DATABASE_URL,
    type: 'postgres',
    synchronize: true,
    logging: false,
    entities: [Post_1.default, User_1.default, ConfirmEmailToken_1.default, Subscription_1.default, PayPalAccessToken_1.default],
    migrations: [
        _1669742463695_emptyMigration_1.emptyMigration1669742463695,
        // postsTableUsersTable1664455607246,
        // verifiedUserAttribute1668256084805,
        // createSubscription1669738765564,
    ],
    subscribers: [],
    ssl: enviroment === 'local'
        ? false
        : {
            rejectUnauthorized: false,
        },
});
//# sourceMappingURL=data-source.js.map