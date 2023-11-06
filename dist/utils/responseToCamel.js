"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.objToCamel = exports.arrayToCamel = void 0;
const lodash_1 = __importDefault(require("lodash"));
const arrayToCamel = (array) => {
    const camelizedArray = array.map((element) => {
        const camelized = lodash_1.default.mapKeys(element, (value, key) => lodash_1.default.camelCase(key));
        return camelized;
    });
    return camelizedArray;
};
exports.arrayToCamel = arrayToCamel;
const objToCamel = (object) => {
    const camelized = lodash_1.default.mapKeys(object, (value, key) => lodash_1.default.camelCase(key));
    return camelized;
};
exports.objToCamel = objToCamel;
//# sourceMappingURL=responseToCamel.js.map