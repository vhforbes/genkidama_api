import { AppDataSource } from '../../data-source';
import TradeOperation from '../../models/TradeOperation';

interface Request {
  author_id: string;
  market: string;
  active: boolean;
  direction: string;
  entry_order_one: number;
  entry_order_two: number;
  entry_order_three: number;
  take_profit_one: number;
  take_profit_two: number;
  stop: number;
  result: string;
}

class CreateTradeOperationService {
  public static async execute({
    author_id,
    market,
    active,
    direction,
    entry_order_one,
    entry_order_two,
    entry_order_three,
    take_profit_one,
    take_profit_two,
    stop,
    result,
  }: Request): Promise<TradeOperation | null> {
    const tradeOperationsRepository =
      AppDataSource.getRepository(TradeOperation);

    const tradeOperation = tradeOperationsRepository.create({
      user_id: author_id,
      market,
      active,
      direction,
      entry_order_one,
      entry_order_two,
      entry_order_three,
      take_profit_one,
      take_profit_two,
      stop,
      result,
    });

    const results = await tradeOperationsRepository.save(tradeOperation);

    return results;
  }
}

export default CreateTradeOperationService;
