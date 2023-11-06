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
const data_source_1 = require("../data-source");
const roles_1 = require("../enums/roles");
const User_1 = __importDefault(require("../models/User"));
const UsersRepository = data_source_1.AppDataSource.getRepository(User_1.default).extend({
    memberList() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.find({
                relations: {
                    subscription: true,
                },
            });
            const membersAndSubscribers = [];
            users.forEach((user) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (user.telegramId &&
                    (((_a = user.subscription) === null || _a === void 0 ? void 0 : _a.status) === 'ACTIVE' ||
                        user.role === roles_1.roles.member ||
                        user.role === roles_1.roles.admin)) {
                    membersAndSubscribers.push(user);
                }
            }));
            return membersAndSubscribers;
        });
    },
    membersWithActiveAlarms() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.find({
                relations: {
                    subscription: true,
                },
                where: {
                    sendAlarms: true,
                },
            });
            const membersAndSubscribersWithAlarmsOn = [];
            users.forEach((user) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (user.telegramId &&
                    (((_a = user.subscription) === null || _a === void 0 ? void 0 : _a.status) === 'ACTIVE' ||
                        user.role === roles_1.roles.member ||
                        user.role === roles_1.roles.admin)) {
                    membersAndSubscribersWithAlarmsOn.push(user);
                }
            }));
            return membersAndSubscribersWithAlarmsOn;
        });
    },
    adminsList() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.find({
                where: {
                    role: 'ADMIN',
                },
            });
            return users;
        });
    },
});
exports.default = UsersRepository;
//# sourceMappingURL=UsersRepository.js.map