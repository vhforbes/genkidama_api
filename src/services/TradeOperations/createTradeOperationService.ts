import { AppDataSource } from '../../data-source';
import { TradeOperationInterface } from '../../interfaces/TradeOperationInterface';
import TradeOperation from '../../models/TradeOperation';

class CreateTradeOperationService {
  public static async execute(
    request: TradeOperationInterface,
  ): Promise<TradeOperation | null> {
    const tradeOperationsRepository =
      AppDataSource.getRepository(TradeOperation);

    const {
      authorId,
      market,
      active,
      direction,
      entryOrderOne,
      entryOrderTwo,
      entryOrderThree,
      takeProfitOne,
      takeProfitTwo,
      stop,
      result,
    } = request;

    const tradeOperation = tradeOperationsRepository.create({
      author_id: authorId,
      market,
      active,
      direction,
      entry_order_one: entryOrderOne,
      entry_order_two: entryOrderTwo || null,
      entry_order_three: entryOrderThree || null,
      take_profit_one: takeProfitOne,
      take_profit_two: takeProfitTwo || null,
      stop,
      result,
    } as TradeOperation);

    const results = await tradeOperationsRepository.save(tradeOperation);

    return results;
  }
}

export default CreateTradeOperationService;
