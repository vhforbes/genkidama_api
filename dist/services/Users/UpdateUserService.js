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
const data_source_1 = require("../../data-source");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const BitgetAssociatedUids_1 = __importDefault(require("../../models/BitgetAssociatedUids"));
const User_1 = __importDefault(require("../../models/User"));
// EMAIL SERVICE TO-BE IMPLEMENTED WHEN EMAIL ONLINE (?)
class UpdateUserService {
    static execute({ id, name, email, exchangeUID, role, exchangePartner, exchange, onTelegramGroup, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(User_1.default);
            const bitgetUIDRepository = data_source_1.AppDataSource.getRepository(BitgetAssociatedUids_1.default);
            const user = yield userRepository.findOne({
                where: {
                    id,
                },
            });
            if (!user) {
                throw new AppError_1.default('User not found', 400);
            }
            // ---- FIELDS TO UPDATE ----
            user.name = name;
            user.email = email;
            user.role = role;
            user.exchange = exchange;
            user.exchangePartner = exchangePartner;
            user.onTelegramGroup = onTelegramGroup;
            // REFACTOR FOR ALL EXCHANGES
            // ---- BITGET UID UPDATE LOGIC ----
            if (exchangeUID !== user.exchangeUID) {
                const bitgetIdAlreadyInUse = yield userRepository.findOne({
                    where: {
                        exchangeUID,
                    },
                });
                if (bitgetIdAlreadyInUse) {
                    throw new AppError_1.default('Exchange UID already in use', 400);
                }
                user.exchangeUID = exchangeUID;
                // REFACTOR FOR IS EXCHANGE PARTNER
                const isBitgetPartner = yield bitgetUIDRepository.findOne({
                    where: {
                        BitgetUID: exchangeUID,
                    },
                });
                if (isBitgetPartner) {
                    user.exchangePartner = true;
                }
                if (isBitgetPartner && !user.role) {
                    user.role = 'BITGET';
                }
            }
            yield userRepository.save(user);
            return user;
        });
    }
}
exports.default = UpdateUserService;
//# sourceMappingURL=UpdateUserService.js.map