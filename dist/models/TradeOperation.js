"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const typeorm_1 = require("typeorm");
const User_1 = __importDefault(require("./User"));
const TradeOperationHistory_1 = __importDefault(require("./TradeOperationHistory"));
let TradeOperation = class TradeOperation extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TradeOperation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TradeOperation.prototype, "author_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.default, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'author_id' }),
    __metadata("design:type", User_1.default)
], TradeOperation.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TradeOperation.prototype, "market", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 10,
        enum: ['aguardando', 'ativa', 'fechada', 'cancelada'],
    }),
    __metadata("design:type", String)
], TradeOperation.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TradeOperation.prototype, "direction", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TradeOperation.prototype, "observation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], TradeOperation.prototype, "entry_order_one", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'float' }),
    __metadata("design:type", Number)
], TradeOperation.prototype, "entry_order_two", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'float' }),
    __metadata("design:type", Number)
], TradeOperation.prototype, "entry_order_three", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], TradeOperation.prototype, "take_profit_one", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'float' }),
    __metadata("design:type", Number)
], TradeOperation.prototype, "take_profit_two", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], TradeOperation.prototype, "stop", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], TradeOperation.prototype, "stopDistance", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TradeOperation.prototype, "result", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], TradeOperation.prototype, "percentual", void 0);
__decorate([
    (0, typeorm_1.Column)('float', { nullable: true }),
    __metadata("design:type", Object)
], TradeOperation.prototype, "riskReturnRatio", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TradeOperation.prototype, "tradingViewLink", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], TradeOperation.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], TradeOperation.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], TradeOperation.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TradeOperationHistory_1.default, (history) => history.tradeOperation),
    __metadata("design:type", Array)
], TradeOperation.prototype, "history", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 30 }),
    __metadata("design:type", Number)
], TradeOperation.prototype, "maxFollowers", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], TradeOperation.prototype, "currentFollowers", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => User_1.default),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Array)
], TradeOperation.prototype, "users", void 0);
TradeOperation = __decorate([
    (0, typeorm_1.Entity)('tradeOperations')
], TradeOperation);
exports.default = TradeOperation;
//# sourceMappingURL=TradeOperation.js.map