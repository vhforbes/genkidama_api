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
exports.createSubscription1669738765564 = void 0;
/* eslint-disable */
const typeorm_1 = require("typeorm");
class createSubscription1669738765564 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.createTable(new typeorm_1.Table({
                name: 'subscriptions',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                    },
                    {
                        name: 'subscription_id',
                        type: 'varchar',
                    },
                    {
                        name: 'plan_id',
                        type: 'varchar',
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        default: 'inactive',
                    },
                    {
                        name: 'current_period_start',
                        type: 'timestamp',
                    },
                    {
                        name: 'current_period_end',
                        type: 'timestamp',
                    },
                    {
                        name: 'canceled_at',
                        type: 'timestamp',
                    },
                ],
            }));
            yield queryRunner.addColumn('users', new typeorm_1.TableColumn({
                name: 'subscription_id',
                type: 'uuid',
            }));
            yield queryRunner.createForeignKey('users', new typeorm_1.TableForeignKey({
                name: 'UserSubscription',
                columnNames: ['subscription_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'subscriptions',
                onDelete: 'CASCADE',
            }));
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = yield queryRunner.getTable('users');
            const foreignKey = table === null || table === void 0 ? void 0 : table.foreignKeys.find(fk => fk.columnNames.indexOf('subscription_id') !== -1);
            if (!foreignKey) {
                throw new Error('Foregin keuy not found');
            }
            yield queryRunner.dropForeignKey('users', foreignKey);
            yield queryRunner.dropTable('subscriptions');
        });
    }
}
exports.createSubscription1669738765564 = createSubscription1669738765564;
//# sourceMappingURL=1669738765564-createSubscription.js.map