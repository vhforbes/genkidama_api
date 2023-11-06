"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceCommasWithDots = void 0;
function replaceCommasWithDots(obj) {
    const newObj = {};
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (typeof value === 'string') {
            newObj[key] = value.replace(/,/g, '.');
        }
        else if (typeof value === 'object' && value !== null) {
            newObj[key] = replaceCommasWithDots(value);
        }
        else {
            newObj[key] = value;
        }
    });
    return newObj;
}
exports.replaceCommasWithDots = replaceCommasWithDots;
//# sourceMappingURL=replaceCommasWithDots.js.map