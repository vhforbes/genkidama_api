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
const express_1 = require("express");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const GetXdecowDataService_1 = __importDefault(require("../services/Xdecow/GetXdecowDataService"));
const xdecowRouter = (0, express_1.Router)();
xdecowRouter.get('/', ensureAuthenticated_1.ensureAutenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const xdecowData = yield GetXdecowDataService_1.default.execute();
    return res.json(xdecowData);
}));
exports.default = xdecowRouter;
//# sourceMappingURL=xdecow.router.js.map