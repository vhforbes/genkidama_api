import { AppDataSource } from '../../data-source';
import BybitUID from '../../models/BybitAssociatedUids';
import User from '../../models/User';
import { Repository } from 'typeorm';
import UpdateBybitAssociateService from './UpdateBybitAssociatesService';

jest.mock('../../data-source');

describe('UpdateBybitAssociateService', () => {
  let bybitUIDRepository: jest.Mocked<Repository<BybitUID>>;
  let userRepository: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    bybitUIDRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      // ... any other methods you use
    } as any;

    userRepository = {
      find: jest.fn(),
      save: jest.fn(),
      // ... any other methods you use
    } as any;

    jest.spyOn(AppDataSource, 'getRepository').mockImplementation(model => {
      if (model === BybitUID) return bybitUIDRepository as any;
      if (model === User) return userRepository as any;
      throw new Error('Unknown model');
    });
  });

  // Reset mocks after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add new UIDs and update user partner status', async () => {
    // Arrange
    const uidList = ['UID1', 'UID2'];

    userRepository.find.mockResolvedValue([
      { exchangeUID: 'UID1', exchangePartner: false, role: '' } as User,
      { exchangeUID: 'UID2', exchangePartner: false, role: '' } as User,
      { exchangeUID: 'UID3', exchangePartner: false, role: '' } as User,
      // Add more user mock objects as needed
    ]);

    bybitUIDRepository.findOne.mockResolvedValue(null); // Mock as if UID does not exist

    // Act
    await UpdateBybitAssociateService.execute({ uidList });

    // Assert
    expect(bybitUIDRepository.save).toHaveBeenCalledTimes(2); // Adjust as needed
    expect(userRepository.save).toHaveBeenCalledTimes(2); // Adjust as needed
  });

  // Write more test cases to cover different scenarios
});
