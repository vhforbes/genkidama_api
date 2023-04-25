import { followingSucessfully } from '../../../bot/tradeOperationsBot/followingSucessfully';
import { AppDataSource } from '../../../data-source';
import AppError from '../../../errors/AppError';
import TradeOperation from '../../../models/TradeOperation';
import User from '../../../models/User';

class AddTradeOperationToUser {
  public static async execute(
    userId: string,
    tradeOperationId: string,
  ): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);
    const tradeOperationRepository =
      AppDataSource.getRepository(TradeOperation);

    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['tradeOperations'],
    });

    const tradeOperation = await tradeOperationRepository.findOne({
      where: { id: tradeOperationId },
    });

    if (!user) {
      throw new AppError('user not found');
    }

    if (!tradeOperation) {
      throw new AppError('trade operation not found');
    }

    user.tradeOperations = [...user.tradeOperations, tradeOperation];

    await userRepository.save(user);

    followingSucessfully(tradeOperation, user.telegramId);

    return user;
  }
}

export default AddTradeOperationToUser;
