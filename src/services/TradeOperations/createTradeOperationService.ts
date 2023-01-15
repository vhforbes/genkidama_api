import { AppDataSource } from '../../data-source';
import TradeOperation from '../../models/TradeOperation';

interface Request {
  userId: string;
  market: string;
  active: boolean;
  direction: string;
  entryOrderOne: number;
  entryOrderTwo?: number;
  entryOrderThree?: number;
  takeProfitOne: number;
  takeProfitTwo?: number;
  stop: number;
}

class CreateTradeOperationService {
  public static async execute({
    userId,
    market,
    active,
    direction,
    entryOrderOne,
    entryOrderTwo,
    entryOrderThree,
    takeProfitOne,
    takeProfitTwo,
    stop,
  }: Request): Promise<TradeOperation | null> {
    const tradeOperationsRepository =
      AppDataSource.getRepository(TradeOperation);

    const tradeOperation = tradeOperationsRepository.create({
      user_id: userId,
      market,
      active,
      direction,
      entry_order_one: entryOrderOne,
      entry_order_two: entryOrderTwo,
      entry_order_three: entryOrderThree,
      take_profit_one: takeProfitOne,
      take_profit_two: takeProfitTwo,
      stop,
    });

    const results = await tradeOperationsRepository.save(tradeOperation);

    return results;
  }
}

export default CreateTradeOperationService;
