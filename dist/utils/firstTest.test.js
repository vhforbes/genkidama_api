"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firstTest_1 = __importDefault(require("./firstTest"));
test('myFunction should return expected result', () => {
    expect((0, firstTest_1.default)()).toBe(2);
});
//# sourceMappingURL=firstTest.test.js.map