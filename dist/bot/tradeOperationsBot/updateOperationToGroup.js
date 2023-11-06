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
exports.updateOperationToGroup = void 0;
const sendMessageToUsers_1 = __importDefault(require("../utils/sendMessageToUsers"));
// const groupId = process.env.GROUP_ID as string;
const updateOperationToGroup = (tradeOperation, users) => __awaiter(void 0, void 0, void 0, function* () {
    const { market, direction, 
    // entry_order_one = `$ ${tradeOperation.entry_order_one}`,
    // entry_order_two = '-',
    // entry_order_three = '-',
    // take_profit_one,
    // take_profit_two = '-',
    result = '', status, 
    // stop,
    observation, } = tradeOperation;
    const messageHtml = `
<b>OPERAÇÃO ATUALIZADA</b>: 
<b>${market}</b> | ${direction} | ${status} | ${result || ''}
${`<b>Obs:  ${observation}</b>\n`}
`;
    yield (0, sendMessageToUsers_1.default)({ users, messageHtml });
});
exports.updateOperationToGroup = updateOperationToGroup;
// IF NEEDED IN THE FUTURE 03/05
// <b>ENTRADAS:</b>
// 1. $ ${entry_order_one}
// 2. $ ${entry_order_two}
// 3. $ ${entry_order_three}
// <b>STOP:</b>
// $ ${stop}
// <b>TAKE PROFIT</b>
// 1. $ ${take_profit_one}
// 2. $ ${take_profit_two}
//# sourceMappingURL=updateOperationToGroup.js.map