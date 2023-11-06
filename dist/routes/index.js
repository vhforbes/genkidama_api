"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const forms_router_1 = __importDefault(require("./forms.router"));
const paypal_router_1 = __importDefault(require("./paypal.router"));
const sessions_router_1 = __importDefault(require("./sessions.router"));
const subscriptions_1 = __importDefault(require("./subscriptions"));
const tradeOperations_router_1 = __importDefault(require("./tradeOperations.router"));
const users_router_1 = __importDefault(require("./users.router"));
const exclusiveVideos_router_1 = __importDefault(require("./exclusiveVideos.router"));
const bitget_router_1 = __importDefault(require("./bitget.router"));
const mestreKame_router_1 = __importDefault(require("./mestreKame.router"));
const alarms_router_1 = __importDefault(require("./alarms.router"));
const xdecow_router_1 = __importDefault(require("./xdecow.router"));
const tradingview_router_1 = __importDefault(require("./tradingview.router"));
const routes = (0, express_1.Router)();
routes.use('/users', users_router_1.default);
routes.use('/exclusive-videos', exclusiveVideos_router_1.default);
routes.use('/sessions', sessions_router_1.default);
routes.use('/paypal', paypal_router_1.default);
routes.use('/subscriptions', subscriptions_1.default);
routes.use('/trade-operations', tradeOperations_router_1.default);
routes.use('/forms', forms_router_1.default);
routes.use('/bitget', bitget_router_1.default);
routes.use('/mestrekame', mestreKame_router_1.default);
routes.use('/alarms', alarms_router_1.default); // TO BE DELETED IN FUTURE
routes.use('/tradingview', tradingview_router_1.default);
routes.use('/xdecow', xdecow_router_1.default);
exports.default = routes;
//# sourceMappingURL=index.js.map