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
const data_source_1 = require("../data-source");
const ensureAdmin_1 = require("../middlewares/ensureAdmin");
const ensureAuthenticated_1 = require("../middlewares/ensureAuthenticated");
const BitgetAssociatedUids_1 = __importDefault(require("../models/BitgetAssociatedUids"));
const UpdatedBitgetAssociatesService_1 = __importDefault(require("../services/Exchanges/UpdatedBitgetAssociatesService"));
const bitgetRouter = (0, express_1.Router)();
bitgetRouter.use(ensureAuthenticated_1.ensureAutenticated);
bitgetRouter.post('/associated', ensureAdmin_1.ensureAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uidList } = req.body;
    yield UpdatedBitgetAssociatesService_1.default.execute({ uidList });
    return res.json({ result: 'List updated' });
}));
bitgetRouter.get('/associated', ensureAdmin_1.ensureAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bitgetUIDRepository = data_source_1.AppDataSource.getRepository(BitgetAssociatedUids_1.default);
    const reponse = yield bitgetUIDRepository.find();
    res.send(reponse);
}));
exports.default = bitgetRouter;
//# sourceMappingURL=bitget.router.js.map