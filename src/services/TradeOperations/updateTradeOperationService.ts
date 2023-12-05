import { updateOperationToGroup } from '../../bot/tradeOperationsBot/updateOperationToGroup';
import sendMessageToAdmins from '../../bot/utils/sendMessageToAdmins';
import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';
import { UpdateTradeOperationInterface } from '../../interfaces/TradeOperationInterface';
import TradeOperation from '../../models/TradeOperation';
import User from '../../models/User';
import { replaceCommasWithDots } from '../../utils/replaceCommasWithDots';
import CreateTradeOperationHistoryService from '../TradeOperationHistory/createTradeOperationHistoryService';

class UpdateTradeOperationService {
  public static async execute(
    request: UpdateTradeOperationInterface,
  ): Promise<TradeOperation | null> {
    try {
      const tradeOperationsRepository =
        AppDataSource.getRepository(TradeOperation);

      // Substitui as , com pontos
      const cleanRequest = replaceCommasWithDots(
        request,
      ) as UpdateTradeOperationInterface;

      // Desestruturaçao para utilizar os valores
      const {
        id,
        market,
        marketLocation,
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
        stopDistance,
        entryOrdersStatus,
        takeProfitStatus,
      } = cleanRequest;

      if (!id) {
        throw new AppError('You must provide a ID');
      }

      // Checa se a operacao existe
      const tradeOperationToUpdate = await tradeOperationsRepository.findOne({
        where: {
          id,
        },
        relations: ['history', 'users'],
      });

      if (!tradeOperationToUpdate) {
        throw new AppError(`Trade operation ${id} could not be found`);
      }

      if (status) {
        const validStatuses = ['aguardando', 'ativa', 'fechada'];

        if (!validStatuses.includes(status)) {
          // Notificar ADM

          throw new AppError('Unauthorized status for trade operation update');
        }
      }

      // Salva a operacao encontrada para o histórico
      const history = await CreateTradeOperationHistoryService.execute(
        tradeOperationToUpdate,
      );

      if (!history) {
        throw new AppError('Could not create history for update');
      }

      tradeOperationToUpdate.history.push(history);

      const assignOrDefault = (
        input: string | undefined,
        defaultValue: number,
      ) => {
        return input ? parseFloat(input) : defaultValue;
      };

      const calcRiskReturnRatio = (perc: number, stopdist: number) => {
        if (perc && stopdist) {
          return perc / stopdist;
        }

        return 0;
      };

      // Cria um objeto com a operacao nova:
      //
      const updatedTradeOperation: Partial<TradeOperation> = {
        id,
        market: market?.trimEnd(),
        marketLocation,
        status: status || tradeOperationToUpdate.status,
        direction: direction || tradeOperationToUpdate.direction,
        entry_order_one: assignOrDefault(
          entryOrderOne,
          tradeOperationToUpdate.entry_order_one,
        ),
        entry_order_two: assignOrDefault(
          entryOrderTwo,
          tradeOperationToUpdate.entry_order_two,
        ),
        entry_order_three: assignOrDefault(
          entryOrderThree,
          tradeOperationToUpdate.entry_order_three,
        ),
        take_profit_one: assignOrDefault(
          takeProfitOne,
          tradeOperationToUpdate.take_profit_one,
        ),
        take_profit_two: assignOrDefault(
          takeProfitTwo,
          tradeOperationToUpdate.take_profit_two,
        ),
        stop: assignOrDefault(stop, tradeOperationToUpdate.stop),
        result: result || tradeOperationToUpdate.result,
        percentual: assignOrDefault(
          percentual,
          tradeOperationToUpdate.percentual,
        ),
        riskReturnRatio: calcRiskReturnRatio(
          parseFloat(percentual as string),
          parseFloat(stopDistance as string),
        ),
        stopDistance: assignOrDefault(
          stopDistance,
          tradeOperationToUpdate.stopDistance,
        ),
        observation: observation || tradeOperationToUpdate.observation || '',
        version: tradeOperationToUpdate.version + 1,
        maxFollowers: maxFollowers || tradeOperationToUpdate.maxFollowers,
        tradingViewLink,
        entryOrdersStatus,
        takeProfitStatus,
      };

      // Clean it up so the invalid values are not sent to the DB
      const cleanUpdatedTradeOperation = Object.fromEntries(
        Object.entries(updatedTradeOperation).filter(
          ([_, v]) => v != null && !Number.isNaN(v),
        ),
      );

      await tradeOperationsRepository.save(cleanUpdatedTradeOperation);

      const afterUpdateTradeOperation = await tradeOperationsRepository.findOne(
        {
          where: {
            id,
          },
        },
      );

      if (!afterUpdateTradeOperation) {
        throw new AppError('Could not find operation after update');
      }

      // Avoids breaking if there is no telegramID
      const usersWithTelegramID = tradeOperationToUpdate.users.filter(
        (user: User) => user.telegramId !== null,
      );

      await updateOperationToGroup(
        afterUpdateTradeOperation,
        usersWithTelegramID,
      );

      const messageHtml = `
      <b>OPERAÇÃO ATUALIZADA</b>: 
      <b>${market}</b> | ${direction} | ${status} | ${result || ''}
      ${`<b>Obs:  ${observation}</b>\n`}
      `;

      await sendMessageToAdmins({ messageHtml });

      return afterUpdateTradeOperation;
    } catch (error: any) {
      console.error(error); // Log the error for debugging

      const message =
        error && typeof error.message === 'string'
          ? error.message
          : 'An unexpected error occurred';

      await sendMessageToAdmins({
        messageHtml: `
        Error updating trade operation:
        ${message}`,
      });

      throw error;
    }
  }
}

export default UpdateTradeOperationService;
