import AppError from '../../errors/AppError';
import { ResponseTradeOperationInterface } from '../../interfaces/TradeOperationInterface';
import TradeOperationsRepository from '../../repositories/TradeOperationsRepository';
import { arrayToCamel, objToCamel } from '../../utils/responseToCamel';

interface TradeOperationWithHistory {
  tradeOperation: ResponseTradeOperationInterface;
  history: ResponseTradeOperationInterface[];
}

class GetTradeOperationHistory {
  public static async execute(
    id: string,
  ): Promise<TradeOperationWithHistory | null> {
    const tradeOperationResponse = await TradeOperationsRepository.findOne({
      where: {
        id,
      },
      relations: ['history', 'history.tradeOperation'],
    });

    if (!tradeOperationResponse) {
      throw new AppError('Unable to retrieve trade operation');
    }

    const tradeOperation: ResponseTradeOperationInterface = <
      ResponseTradeOperationInterface
    >objToCamel(tradeOperationResponse);

    if (!tradeOperation.history) {
      throw new AppError('Unable to retrieve history of trade operation');
    }

    const history: ResponseTradeOperationInterface[] = <
      ResponseTradeOperationInterface[]
    >arrayToCamel(tradeOperation?.history);

    delete tradeOperation.history;

    return {
      tradeOperation,
      history,
    };
  }
}

export default GetTradeOperationHistory;
