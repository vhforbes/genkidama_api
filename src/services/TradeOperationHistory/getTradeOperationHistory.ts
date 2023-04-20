import AppError from '../../errors/AppError';
import { TradeOperationInterface } from '../../interfaces/TradeOperationInterface';
import TradeOperationsRepository from '../../repositories/TradeOperationsRepository';
import { arrayToCamel, objToCamel } from '../../utils/responseToCamel';

interface TradeOperationWithHistory {
  tradeOperation: TradeOperationInterface;
  history: TradeOperationInterface[];
}

class GetTradeOperationHistory {
  public static async execute(
    id: string,
  ): Promise<TradeOperationWithHistory | null> {
    const tradeOperationResponse = await TradeOperationsRepository.findOne({
      where: {
        id,
      },
      relations: ['history'],
    });

    if (!tradeOperationResponse) {
      throw new AppError('Unable to retrieve trade operation');
    }

    const tradeOperation: TradeOperationInterface = <TradeOperationInterface>(
      objToCamel(tradeOperationResponse)
    );

    if (!tradeOperation.history) {
      throw new AppError('Unable to retrieve history of trade operation');
    }

    const history: TradeOperationInterface[] = <TradeOperationInterface[]>(
      arrayToCamel(tradeOperation?.history)
    );

    delete tradeOperation.history;

    return {
      tradeOperation,
      history,
    };
  }
}

export default GetTradeOperationHistory;
