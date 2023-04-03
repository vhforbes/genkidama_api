import { newOperationToGroup } from '../../bot/tradeOperationsBot/newOperationToGroup';
import { AppDataSource } from '../../data-source';
import { PayloadTradeOperationInterface } from '../../interfaces/TradeOperationInterface';
import TradeOperation from '../../models/TradeOperation';
import { replaceCommasWithDots } from '../../utils/replaceCommasWithDots';

class CreateTradeOperationService {
  public static async execute(
    request: PayloadTradeOperationInterface,
  ): Promise<TradeOperation | null> {
    const tradeOperationsRepository =
      AppDataSource.getRepository(TradeOperation);

    const cleanRequest = replaceCommasWithDots(request);

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
    } = cleanRequest;

    const tradeOperation = tradeOperationsRepository.create({
      author_id: authorId,
      market,
      active,
      direction,
      entry_order_one: parseFloat(entryOrderOne),
      entry_order_two: entryOrderTwo ? parseFloat(entryOrderTwo) : null,
      entry_order_three: entryOrderThree ? parseFloat(entryOrderThree) : null,
      take_profit_one: parseFloat(takeProfitOne),
      take_profit_two: takeProfitTwo ? parseFloat(takeProfitTwo) : null,
      stop: parseFloat(stop),
      result,
    } as TradeOperation);

    const results = await tradeOperationsRepository.save(tradeOperation);

    newOperationToGroup(-1001875967546, request);

    return results;
  }
}

export default CreateTradeOperationService;
