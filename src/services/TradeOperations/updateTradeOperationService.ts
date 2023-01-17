import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';
import TradeOperation from '../../models/TradeOperation';

interface Request {
  id: string;
  market?: string;
  active?: boolean;
  direction?: string;
  entry_order_one?: number;
  entry_order_two?: number;
  entry_order_three?: number;
  take_profit_one?: number;
  take_profit_two?: number;
  stop?: number;
  result?: string;
}

class UpdateTradeOperationService {
  public static async execute(
    tradeOperation: Request,
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
