import { updateOperationToGroup } from '../../bot/tradeOperationsBot/updateOperationToGroup';
import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';
import { PayloadTradeOperationInterface } from '../../interfaces/TradeOperationInterface';
import TradeOperation from '../../models/TradeOperation';
import { replaceCommasWithDots } from '../../utils/replaceCommasWithDots';
import CreateTradeOperationHistoryService from '../TradeOperationHistory/createTradeOperationHistoryService';

class UpdateTradeOperationService {
  public static async execute(
    request: PayloadTradeOperationInterface,
  ): Promise<TradeOperation | null> {
    const tradeOperationsRepository =
      AppDataSource.getRepository(TradeOperation);

    // Substitui as , com pontos
    const cleanRequest = replaceCommasWithDots(
      request,
    ) as PayloadTradeOperationInterface;

    // Desestruturaçao para utilizar os valores
    const {
      id,
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
      observation,
      percentual,
      maxFollowers,
      tradingViewLink,
    } = cleanRequest;

    // Checa se a operacao existe
    const tradeOperationToUpdate = await tradeOperationsRepository.findOne({
      where: {
        id,
      },
      relations: ['history', 'users'],
    });

    if (!tradeOperationToUpdate) {
      throw new AppError('Trade operation could not be found');
    }

    // Salva a operacao encontrada para o histórico
    const history = await CreateTradeOperationHistoryService.execute(
      tradeOperationToUpdate,
    );

    if (!history) {
      throw new AppError('Could not create history for update');
    }

    tradeOperationToUpdate.history.push(history);

    // Cria um objeto com a operacao nova, valores novos
    const updatedTradeOperation: Partial<TradeOperation> = {
      id,
      market: market?.trimEnd(),
      status,
      direction,
      entry_order_one: parseFloat(entryOrderOne),
      entry_order_two: entryOrderTwo ? parseFloat(entryOrderTwo) : undefined,
      entry_order_three: entryOrderThree
        ? parseFloat(entryOrderThree)
        : undefined,
      take_profit_one: parseFloat(takeProfitOne),
      take_profit_two: takeProfitTwo ? parseFloat(takeProfitTwo) : undefined,
      stop: parseFloat(stop),
      result: result || '',
      percentual: percentual ? parseFloat(percentual) : undefined,
      observation: observation || '',
      version: tradeOperationToUpdate.version + 1,
      maxFollowers: maxFollowers,
      tradingViewLink,
    };

    // Clean it up so the invalid values are not sent to the DB
    const cleanUpdatedTradeOperation = Object.fromEntries(
      Object.entries(updatedTradeOperation).filter(
        ([_, v]) => v != null && !Number.isNaN(v),
      ),
    );

    await tradeOperationsRepository.save(cleanUpdatedTradeOperation);

    const afterUpdateTradeOperation = await tradeOperationsRepository.findOne({
      where: {
        id,
      },
    });

    if (!afterUpdateTradeOperation) {
      throw new AppError('Could not find operation after update');
    }

    updateOperationToGroup(
      afterUpdateTradeOperation,
      tradeOperationToUpdate.users,
    );

    return afterUpdateTradeOperation;
  }
}

export default UpdateTradeOperationService;
