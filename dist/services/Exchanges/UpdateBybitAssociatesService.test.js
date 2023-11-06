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
const BybitAssociatedUids_1 = __importDefault(require("../../models/BybitAssociatedUids"));
const User_1 = __importDefault(require("../../models/User"));
const UpdateBybitAssociatesService_1 = __importDefault(require("./UpdateBybitAssociatesService"));
jest.mock('../../data-source');
describe('UpdateBybitAssociateService', () => {
    let bybitUIDRepository;
    let userRepository;
    beforeEach(() => {
        bybitUIDRepository = {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            // ... any other methods you use
        };
        userRepository = {
            find: jest.fn(),
            save: jest.fn(),
            // ... any other methods you use
        };
        jest.spyOn(data_source_1.AppDataSource, 'getRepository').mockImplementation(model => {
            if (model === BybitAssociatedUids_1.default)
                return bybitUIDRepository;
            if (model === User_1.default)
                return userRepository;
            throw new Error('Unknown model');
        });
    });
    // Reset mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should add new UIDs and update user partner status', () => __awaiter(void 0, void 0, void 0, function* () {
        // Arrange
        const uidList = ['UID1', 'UID2'];
        userRepository.find.mockResolvedValue([
            { exchangeUID: 'UID1', exchangePartner: false, role: '' },
            { exchangeUID: 'UID2', exchangePartner: false, role: '' },
            { exchangeUID: 'UID3', exchangePartner: false, role: '' },
            // Add more user mock objects as needed
        ]);
        bybitUIDRepository.findOne.mockResolvedValue(null); // Mock as if UID does not exist
        // Act
        yield UpdateBybitAssociatesService_1.default.execute({ uidList });
        // Assert
        expect(bybitUIDRepository.save).toHaveBeenCalledTimes(2); // Adjust as needed
        expect(userRepository.save).toHaveBeenCalledTimes(2); // Adjust as needed
    }));
    // Write more test cases to cover different scenarios
});
//# sourceMappingURL=UpdateBybitAssociatesService.test.js.map