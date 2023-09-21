import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';
import TradeOperation from '../../models/TradeOperation';

class ListTradeOperationsService {
  public static async execute(): Promise<{}> {
    const TradeOperationsRepository =
      AppDataSource.getRepository(TradeOperation);

    const TradeOperations = await TradeOperationsRepository.find({
      order: {
        updated_at: 'DESC',
      },
    });

    if (!TradeOperations) {
      throw new AppError('Could not retrieve list of TradeOperations');
    }

    return {
      TradeOperations,
    };
  }
}

export default ListTradeOperationsService;
