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
exports.AddExchangeColumn1630840800000 = void 0;
class AddExchangeColumn1630840800000 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // Add new column 'exchange'
            yield queryRunner.query('ALTER TABLE users ADD COLUMN exchange character varying');
            // Copy data from 'role' to 'exchange' where role = 'BITGET'
            yield queryRunner.query("UPDATE users SET exchange = 'BITGET' WHERE role = 'BITGET'");
            // Update 'role' to NULL where role = 'BITGET'
            yield queryRunner.query("UPDATE users SET role = NULL WHERE role = 'BITGET'");
            // Delete 'BITGET' from 'role'
            yield queryRunner.query("DELETE FROM users WHERE role = 'BITGET'");
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            // If needed, reset 'role' where 'exchange' = 'BITGET'
            yield queryRunner.query("UPDATE users SET role = 'BITGET' WHERE exchange = 'BITGET'");
            // Remove 'exchange' column
            yield queryRunner.query('ALTER TABLE users DROP COLUMN exchange');
        });
    }
}
exports.AddExchangeColumn1630840800000 = AddExchangeColumn1630840800000;
//# sourceMappingURL=1693920362640-AddExchangeColumn.js.map