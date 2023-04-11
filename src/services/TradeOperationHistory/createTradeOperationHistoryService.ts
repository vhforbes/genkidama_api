import { AppDataSource } from '../../data-source';
import TradeOperation from '../../models/TradeOperation';
import { TradeOperationHistory } from '../../models/TradeOperationHistory';

class CreateTradeOperationHistoryService {
  public static async execute(
    tradeOperationToUpdate: TradeOperation,
  ): Promise<TradeOperationHistory | null> {
    const tradeOperationHistoryRepository = AppDataSource.getRepository(
      TradeOperationHistory,
    );

    const history = {} as TradeOperationHistory;

    history.market = tradeOperationToUpdate.market;
    history.direction = tradeOperationToUpdate.direction;
    history.active = tradeOperationToUpdate.active;
    history.entry_order_one = tradeOperationToUpdate.entry_order_one;
    history.entry_order_two = tradeOperationToUpdate.entry_order_two;
    history.entry_order_three = tradeOperationToUpdate.entry_order_three;
    history.take_profit_one = tradeOperationToUpdate.take_profit_one;
    history.take_profit_two = tradeOperationToUpdate.take_profit_two;
    history.stop = tradeOperationToUpdate.stop;
    history.result = tradeOperationToUpdate.result;
    history.percentual = tradeOperationToUpdate.percentual;
    history.observation = tradeOperationToUpdate.observation;
    history.version = tradeOperationToUpdate.version;
    history.tradeOperation = tradeOperationToUpdate;

    tradeOperationHistoryRepository.save(history);

    return history;
  }
}

export default CreateTradeOperationHistoryService;
