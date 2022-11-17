"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const posts_router_1 = __importDefault(require("./posts.router"));
const sessions_router_1 = __importDefault(require("./sessions.router"));
const users_router_1 = __importDefault(require("./users.router"));
const routes = (0, express_1.Router)();
routes.use('/users', users_router_1.default);
routes.use('/posts', posts_router_1.default);
routes.use('/sessions', sessions_router_1.default);
exports.default = routes;
