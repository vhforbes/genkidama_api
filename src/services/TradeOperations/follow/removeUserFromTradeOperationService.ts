import { AppDataSource } from '../../../data-source';
import AppError from '../../../errors/AppError';
import TradeOperation from '../../../models/TradeOperation';

class RemoveUserFromTradeOperation {
  public static async execute(
    userId: string,
    tradeOperationId: string,
  ): Promise<TradeOperation> {
    const tradeOperationRepository =
      AppDataSource.getRepository(TradeOperation);

    const tradeOperation = await tradeOperationRepository.findOne({
      where: { id: tradeOperationId },
      relations: ['users'],
    });

    if (!tradeOperation) {
      throw new AppError('trade operation not found');
    }

    const indexToRemove = tradeOperation?.users.findIndex(
      user => user.id === userId,
    );

    if (indexToRemove === -1) {
      throw new AppError('User not found for trade operation');
    }

    tradeOperation.users.splice(indexToRemove, 1);

    tradeOperation.currentFollowers -= 1;

    await tradeOperationRepository.save(tradeOperation);

    return tradeOperation;
  }
}

export default RemoveUserFromTradeOperation;
