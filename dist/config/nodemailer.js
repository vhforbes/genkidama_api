"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    service: 'SendinBlue',
    auth: {
        user: 'vhforbes@gmail.com',
        pass: 'D5QEBZxvOqygt1XN',
    },
});
//# sourceMappingURL=nodemailer.js.map