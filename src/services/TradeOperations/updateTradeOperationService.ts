import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';
import { TradeOperationInterface } from '../../interfaces/TradeOperationInterface';
import TradeOperation from '../../models/TradeOperation';

class UpdateTradeOperationService {
  public static async execute(
    tradeOperation: TradeOperationInterface,
  ): Promise<TradeOperation | null> {
    const tradeOperationsRepository =
      AppDataSource.getRepository(TradeOperation);

    const tradeOperationToUpdate = await tradeOperationsRepository.findOne({
      where: {
        id: tradeOperation.id,
      },
    });

    if (!tradeOperationToUpdate) {
      throw new AppError('Trade operation could not be found');
    }

    const results = await tradeOperationsRepository.save(tradeOperation);

    return results;
  }
}

export default UpdateTradeOperationService;
