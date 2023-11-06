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
const data_source_1 = require("../../data-source");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const LiveStatus_1 = __importDefault(require("../../models/LiveStatus"));
class StartLiveService {
    static execute({ live }) {
        return __awaiter(this, void 0, void 0, function* () {
            const liveStatusRepository = data_source_1.AppDataSource.getRepository(LiveStatus_1.default);
            let liveStatus = yield liveStatusRepository.find();
            try {
                if (liveStatus.length > 0) {
                    yield liveStatusRepository.delete(liveStatus[0]);
                    liveStatus = yield liveStatusRepository.find(); // Refetch after deleting
                }
                if (!liveStatus.length) {
                    const createdLive = liveStatusRepository.create({ live: live });
                    yield liveStatusRepository.save(createdLive);
                }
            }
            catch (error) {
                console.error(error);
                throw new AppError_1.default('Não foi possivel abrir a Live');
            }
        });
    }
}
exports.default = StartLiveService;
//# sourceMappingURL=StartLiveService.js.map