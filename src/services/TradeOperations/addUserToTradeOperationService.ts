import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';
import TradeOperation from '../../models/TradeOperation';
import User from '../../models/User';

class AddUserToTradeOperation {
  public static async execute(
    userId: string,
    tradeOperationId: string,
  ): Promise<TradeOperation> {
    const userRepository = AppDataSource.getRepository(User);
    const tradeOperationRepository =
      AppDataSource.getRepository(TradeOperation);

    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['tradeOperations'],
    });

    const tradeOperation = await tradeOperationRepository.findOne({
      where: { id: tradeOperationId },
      relations: ['users'],
    });

    if (!user) {
      throw new AppError('user not found');
    }

    if (!tradeOperation) {
      throw new AppError('trade operation not found');
    }

    user.tradeOperations = [...user.tradeOperations, tradeOperation];
    tradeOperation.users = [...tradeOperation.users, user];

    await userRepository.save(user);
    await tradeOperationRepository.save(tradeOperation);

    return tradeOperation;
  }
}

export default AddUserToTradeOperation;
