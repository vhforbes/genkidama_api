"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Subscription_1 = __importDefault(require("./models/Subscription"));
const User_1 = __importDefault(require("./models/User"));
const ConfirmEmailToken_1 = __importDefault(require("./models/ConfirmEmailToken"));
const PayPalAccessToken_1 = __importDefault(require("./models/PayPalAccessToken"));
const TradeOperation_1 = __importDefault(require("./models/TradeOperation"));
const MentoriaForm_1 = __importDefault(require("./models/MentoriaForm"));
const ExclusiveVideo_1 = __importDefault(require("./models/ExclusiveVideo"));
const BitgetAssociatedUids_1 = __importDefault(require("./models/BitgetAssociatedUids"));
const TradeOperationHistory_1 = __importDefault(require("./models/TradeOperationHistory"));
const _1693913129073_RenameIsBitgetPartnerToIsExchangePartner_1 = require("./migrations/1693913129073-RenameIsBitgetPartnerToIsExchangePartner");
const _1693920362640_AddExchangeColumn_1 = require("./migrations/1693920362640-AddExchangeColumn");
const BybitAssociatedUids_1 = __importDefault(require("./models/BybitAssociatedUids"));
const LiveStatus_1 = __importDefault(require("./models/LiveStatus"));
const _1695737139838_UpdateRiskReturnRatio_1 = require("./migrations/1695737139838-UpdateRiskReturnRatio");
dotenv_1.default.config();
const enviroment = process.env.ENVIROMENT;
exports.AppDataSource = new typeorm_1.DataSource({
    url: process.env.DATABASE_URL,
    type: 'postgres',
    synchronize: true,
    logging: false,
    entities: [
        ExclusiveVideo_1.default,
        User_1.default,
        ConfirmEmailToken_1.default,
        Subscription_1.default,
        PayPalAccessToken_1.default,
        TradeOperation_1.default,
        TradeOperationHistory_1.default,
        MentoriaForm_1.default,
        BitgetAssociatedUids_1.default,
        BybitAssociatedUids_1.default,
        LiveStatus_1.default,
    ],
    migrations: [
        _1693913129073_RenameIsBitgetPartnerToIsExchangePartner_1.RenameIsBitgetPartnerToIsExchangePartner1693913129073,
        _1693920362640_AddExchangeColumn_1.AddExchangeColumn1630840800000,
        _1695737139838_UpdateRiskReturnRatio_1.UpdateRiskReturnRatio1695737139838,
    ],
    subscribers: [],
    ssl: enviroment === 'local'
        ? false
        : {
            rejectUnauthorized: false,
        },
});
//# sourceMappingURL=data-source.js.map