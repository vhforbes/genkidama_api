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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenameIsBitgetPartnerToIsExchangePartner1693913129073 = void 0;
class RenameIsBitgetPartnerToIsExchangePartner1693913129073 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.renameColumn('users', 'bitgetPartner', 'exchangePartner');
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.renameColumn('users', 'exchangePartner', 'bitgetPartner');
        });
    }
}
exports.RenameIsBitgetPartnerToIsExchangePartner1693913129073 = RenameIsBitgetPartnerToIsExchangePartner1693913129073;
//# sourceMappingURL=1693913129073-RenameIsBitgetPartnerToIsExchangePartner.js.map