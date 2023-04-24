import { AppDataSource } from '../../../data-source';
import AppError from '../../../errors/AppError';
import User from '../../../models/User';

class RemoveTradeOperationFromUser {
  public static async execute(
    userId: string,
    tradeOperationId: string,
  ): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['tradeOperations'],
    });

    if (!user) {
      throw new AppError('user not found');
    }

    const indexToRemove = user.tradeOperations.findIndex(
      tradeOperation => tradeOperation.id === tradeOperationId,
    );

    if (indexToRemove === -1) {
      throw new AppError('Trade operation not found for user');
    }

    user.tradeOperations.splice(indexToRemove, 1);

    await userRepository.save(user);

    return user;
  }
}

export default RemoveTradeOperationFromUser;
