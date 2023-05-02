import AppError from '../../../errors/AppError';
import TradeOperation from '../../../models/TradeOperation';
import User from '../../../models/User';
import { AppDataSource } from '../../../data-source';

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
    });

    if (!user?.telegramId) {
      throw new AppError(
        'Não encotramos seu ID do telegram... Fale com o @MestreKamee_bot',
      );
    }

    const tradeOperation = await tradeOperationRepository.findOne({
      where: { id: tradeOperationId },
      relations: ['users'],
    });

    if (tradeOperation?.currentFollowers === tradeOperation?.maxFollowers) {
      throw new AppError('A operação está cheia');
    }

    if (!user) {
      throw new AppError('User not found');
    }

    if (!tradeOperation) {
      throw new AppError('Trade operation not found');
    }

    const isAlreadyFollowing = tradeOperation?.users.filter(
      currentUser => currentUser.id === userId,
    );

    if (isAlreadyFollowing?.length !== 0) {
      throw new AppError('You are already following this operation');
    }

    tradeOperation.currentFollowers += 1;

    tradeOperation.users = [...tradeOperation.users, user];

    await tradeOperationRepository.save(tradeOperation);

    return tradeOperation;
  }
}

export default AddUserToTradeOperation;
