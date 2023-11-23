import { v4 } from 'uuid';
import { broadcastNewOperation } from '../../bot/tradeOperationsBot/broadcastNewOperation';
import { AppDataSource } from '../../data-source';
import { PayloadTradeOperationInterface } from '../../interfaces/TradeOperationInterface';
import TradeOperation from '../../models/TradeOperation';
import { replaceCommasWithDots } from '../../utils/replaceCommasWithDots';
import { CronJobManagerService } from '../../services/PriceFetcher/CronJobService';
import { objToCamel } from '../../utils/responseToCamel';

class CreateTradeOperationService {
  public static async execute(
    request: PayloadTradeOperationInterface,
  ): Promise<TradeOperation | null> {
    const tradeOperationsRepository =
      AppDataSource.getRepository(TradeOperation);

    const cleanRequest = replaceCommasWithDots(
      request,
    ) as PayloadTradeOperationInterface;

    const {
      authorId,
      maxFollowers,
      market,
      status,
      direction,
      entryOrderOne,
      entryOrderTwo,
      entryOrderThree,
      takeProfitOne,
      takeProfitTwo,
      stop,
      result,
      percentual,
      observation,
      tradingViewLink,
      stopDistance,
    } = cleanRequest;

    const tradeOperation = tradeOperationsRepository.create({
      id: v4(),
      author_id: authorId,
      market: market.trimEnd(),
      maxFollowers,
      status,
      direction,
      entry_order_one: parseFloat(entryOrderOne),
      entry_order_two: entryOrderTwo ? parseFloat(entryOrderTwo) : null,
      entry_order_three: entryOrderThree ? parseFloat(entryOrderThree) : null,
      take_profit_one: parseFloat(takeProfitOne),
      take_profit_two: takeProfitTwo ? parseFloat(takeProfitTwo) : null,
      stop: parseFloat(stop),
      result,
      observation,
      percentual: percentual ? parseFloat(percentual) : null,
      stopDistance: stopDistance ? parseFloat(stopDistance) : null,
      tradingViewLink,
    } as TradeOperation);

    const results = await tradeOperationsRepository.save(tradeOperation);

    broadcastNewOperation(tradeOperation);

    const cronJobManagerService = new CronJobManagerService();

    cronJobManagerService.startJob(
      objToCamel(tradeOperation) as PayloadTradeOperationInterface,
    );

    return results;
  }
}

export default CreateTradeOperationService;
