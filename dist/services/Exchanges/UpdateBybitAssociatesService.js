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
const typeorm_1 = require("typeorm");
const data_source_1 = require("../../data-source");
const User_1 = __importDefault(require("../../models/User"));
const roles_1 = require("../../enums/roles");
const BybitAssociatedUids_1 = __importDefault(require("../../models/BybitAssociatedUids"));
class UpdateBybitAssociateService {
    static execute({ uidList }) {
        return __awaiter(this, void 0, void 0, function* () {
            const bybitUIDRepository = data_source_1.AppDataSource.getRepository(BybitAssociatedUids_1.default);
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.default);
            const usersWithUID = yield userRepository.find({
                where: {
                    exchangeUID: (0, typeorm_1.Not)((0, typeorm_1.IsNull)()),
                    exchangePartner: false,
                },
            });
            const updatesUidsOnDb = () => __awaiter(this, void 0, void 0, function* () {
                uidList.forEach((uid) => __awaiter(this, void 0, void 0, function* () {
                    const alreadyAdded = yield bybitUIDRepository.findOne({
                        where: { BybitUID: uid },
                    });
                    if (!alreadyAdded) {
                        const newAssociateEntry = bybitUIDRepository.create({
                            BybitUID: uid,
                        });
                        yield bybitUIDRepository.save(newAssociateEntry);
                    }
                }));
            });
            const updateUsersPartnerStatus = () => __awaiter(this, void 0, void 0, function* () {
                usersWithUID.forEach((user) => __awaiter(this, void 0, void 0, function* () {
                    if (uidList.includes(user.exchangeUID)) {
                        const updatedUser = user;
                        updatedUser.exchangePartner = true;
                        updatedUser.role = roles_1.roles.bitget;
                        yield userRepository.save(updatedUser);
                    }
                }));
            });
            yield updatesUidsOnDb();
            yield updateUsersPartnerStatus();
        });
    }
}
exports.default = UpdateBybitAssociateService;
//# sourceMappingURL=UpdateBybitAssociatesService.js.map