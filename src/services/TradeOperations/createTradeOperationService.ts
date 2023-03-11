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
      user_id: authorId,
      market,
      active,
      direction,
      entry_order_one: entryOrderOne,
      entry_order_two: entryOrderTwo,
      entry_order_three: entryOrderThree,
      take_profit_one: takeProfitOne,
      take_profit_two: takeProfitTwo,
      stop,
      result,
    });

    const results = await tradeOperationsRepository.save(tradeOperation);

    return results;
  }
}

export default CreateTradeOperationService;
