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
const TradeOperation_1 = __importDefault(require("./TradeOperation"));
const User_1 = __importDefault(require("./User"));
let TradeOperationHistory = class TradeOperationHistory extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TradeOperationHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TradeOperationHistory.prototype, "author_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.default, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'author_id' }),
    __metadata("design:type", User_1.default)
], TradeOperationHistory.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TradeOperationHistory.prototype, "market", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 10,
        enum: ['aguardando', 'ativa', 'fechada', 'cancelada'],
    }),
    __metadata("design:type", String)
], TradeOperationHistory.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TradeOperationHistory.prototype, "direction", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TradeOperationHistory.prototype, "observation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], TradeOperationHistory.prototype, "entry_order_one", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'float' }),
    __metadata("design:type", Number)
], TradeOperationHistory.prototype, "entry_order_two", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'float' }),
    __metadata("design:type", Number)
], TradeOperationHistory.prototype, "entry_order_three", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], TradeOperationHistory.prototype, "take_profit_one", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'float' }),
    __metadata("design:type", Number)
], TradeOperationHistory.prototype, "take_profit_two", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], TradeOperationHistory.prototype, "stop", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TradeOperationHistory.prototype, "result", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', nullable: true }),
    __metadata("design:type", Number)
], TradeOperationHistory.prototype, "percentual", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 30 }),
    __metadata("design:type", Number)
], TradeOperationHistory.prototype, "maxFollowers", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array', { nullable: true }),
    __metadata("design:type", Number)
], TradeOperationHistory.prototype, "currentFollowers", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TradeOperationHistory.prototype, "tradingViewLink", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], TradeOperationHistory.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], TradeOperationHistory.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 1 }),
    __metadata("design:type", Number)
], TradeOperationHistory.prototype, "version", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => TradeOperation_1.default, tradeOperation => tradeOperation.history, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'tradeOperationId' }),
    __metadata("design:type", TradeOperation_1.default)
], TradeOperationHistory.prototype, "tradeOperation", void 0);
TradeOperationHistory = __decorate([
    (0, typeorm_1.Entity)('tradeOperationsHistory')
], TradeOperationHistory);
exports.default = TradeOperationHistory;
//# sourceMappingURL=TradeOperationHistory.js.map