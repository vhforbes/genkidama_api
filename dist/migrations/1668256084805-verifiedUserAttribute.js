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
exports.verifiedUserAttribute1668256084805 = void 0;
/* eslint-disable */
const typeorm_1 = require("typeorm");
class verifiedUserAttribute1668256084805 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const verified = new typeorm_1.TableColumn({
                name: 'verified',
                type: 'bool',
                default: false,
            });
            yield queryRunner.addColumn('users', verified);
            yield queryRunner.createTable(new typeorm_1.Table({
                name: 'tokens',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'token',
                        type: 'varchar',
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                    },
                ],
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.dropColumn('users', 'verified');
            yield queryRunner.dropTable('tokens');
        });
    }
}
exports.verifiedUserAttribute1668256084805 = verifiedUserAttribute1668256084805;
//# sourceMappingURL=1668256084805-verifiedUserAttribute.js.map