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
exports.UpdateRiskReturnRatio1695737139838 = void 0;
class UpdateRiskReturnRatio1695737139838 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Add new column to the table
            yield queryRunner.query(`ALTER TABLE "tradeOperations" ADD COLUMN riskReturnRatio DECIMAL DEFAULT NULL`);
            // 2. Update existing rows
            yield queryRunner.query(`
            UPDATE "tradeOperations"
            SET riskReturnRatio = percentual / "stopDistance"
            WHERE status = 'fechada' AND "stopDistance" <> 0 AND percentual <> 0
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Reverse the changes
            yield queryRunner.query(`ALTER TABLE "tradeOperations" DROP COLUMN "riskReturnRatio"`);
        });
    }
}
exports.UpdateRiskReturnRatio1695737139838 = UpdateRiskReturnRatio1695737139838;
//# sourceMappingURL=1695737139838-UpdateRiskReturnRatio.js.map