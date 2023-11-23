import dotenv from 'dotenv';
import { objToCamel } from '../../utils/responseToCamel';
import { CronJobManagerService } from './CronJobService';
import { PayloadTradeOperationInterface } from '../../interfaces/TradeOperationInterface';
import TradeOperationsRepository from '../../repositories/TradeOperationsRepository';
import AppError from '../../errors/AppError';
import UpdateTradeOperationService from '../../services/TradeOperations/updateTradeOperationService';
import DeleteTradeOperationService from '../../services/TradeOperations/deleteTradeOperationService';

dotenv.config();

interface PriceData {
  entry: number;
  highest: number;
  lowest: number;
}

// Only receive camelCaseTradeOp
class CheckTradeTriggersService {
  public static async execute(
    tradeOperation: PayloadTradeOperationInterface,
    priceData: PriceData,
  ): Promise<any> {
    const cronJobManagerService = new CronJobManagerService();

    const updatedTradeOperationSource = await TradeOperationsRepository.findOne(
      {
        where: {
          id: tradeOperation.id,
        },
      },
    );

    const camelTradeOperation = objToCamel(
      updatedTradeOperationSource,
    ) as PayloadTradeOperationInterface;

    if (!camelTradeOperation) {
      throw new AppError('Operation not found when running triggers check');
    }

    // --------- Logica para LONGs ---------

    if (camelTradeOperation.direction === 'long') {
      // Pegou Entry 1
      if (
        parseFloat(camelTradeOperation.entryOrderOne) > priceData.lowest &&
        !camelTradeOperation.entryOrdersStatus?.entryOrderOneTriggered
      ) {
        camelTradeOperation.entryOrdersStatus = {
          entryOrderOneTriggered: true,
          entryOrderTwoTriggered: false,
          entryOrderThreeTriggered: false,
        };

        camelTradeOperation.status = 'ativa';

        camelTradeOperation.observation = 'Pegou ordem 1';

        UpdateTradeOperationService.execute(camelTradeOperation);
      }

      // Pegou Entry 2
      if (
        parseFloat(camelTradeOperation.entryOrderTwo as string) >
          priceData.lowest &&
        !camelTradeOperation.entryOrdersStatus?.entryOrderTwoTriggered
      ) {
        camelTradeOperation.entryOrdersStatus = {
          entryOrderOneTriggered: true,
          entryOrderTwoTriggered: true,
          entryOrderThreeTriggered: false,
        };

        camelTradeOperation.observation = 'Pegou ordem 2';

        UpdateTradeOperationService.execute(camelTradeOperation);
      }

      // Pegou Entry 3
      if (
        parseFloat(camelTradeOperation.entryOrderThree as string) >
        priceData.lowest
      ) {
        camelTradeOperation.entryOrdersStatus = {
          entryOrderOneTriggered: true,
          entryOrderTwoTriggered: true,
          entryOrderThreeTriggered: false,
        };

        camelTradeOperation.observation = 'Pegou ordem 3';

        UpdateTradeOperationService.execute(camelTradeOperation);
      }

      // PEGOU STOP
      if (parseFloat(camelTradeOperation.stop) > priceData.lowest) {
        camelTradeOperation.status = 'fechada';
        camelTradeOperation.result = 'loss';

        UpdateTradeOperationService.execute(camelTradeOperation);
      }

      // PEGOU TP1 sem pegar entradas DELETAR OPERAÇÃO
      if (
        parseFloat(camelTradeOperation.takeProfitOne) < priceData.highest &&
        !camelTradeOperation.entryOrdersStatus?.entryOrderOneTriggered
      ) {
        DeleteTradeOperationService.execute({
          id: camelTradeOperation.id,
        });
        cronJobManagerService.stopJob(camelTradeOperation);
      }

      // Pegou TP 1
      if (
        parseFloat(camelTradeOperation.takeProfitOne) < priceData.highest &&
        camelTradeOperation.entryOrdersStatus?.entryOrderOneTriggered &&
        !camelTradeOperation.takeProfitStatus?.takeProfitOneTriggered
      ) {
        camelTradeOperation.takeProfitStatus = {
          takeProfitOneTriggered: true,
          takeProfitTwoTriggered: false,
          takeProfitThreeTriggered: false,
        };

        camelTradeOperation.observation = 'Take profit 1';
      }

      // Pegou TP 2
      // console.log({
      //   takeProfitTwo: camelTradeOperation.takeProfitTwo,
      //   parsedTakeProfitTwo: parseFloat(
      //     camelTradeOperation.takeProfitTwo as string,
      //   ),
      //   entryOrderOneTriggered:
      //     camelTradeOperation.entryOrdersStatus?.entryOrderOneTriggered,
      //   takeProfitTwoTriggered:
      //     camelTradeOperation.takeProfitStatus?.takeProfitTwoTriggered,
      // });

      console.log(
        parseFloat(camelTradeOperation.takeProfitTwo as string) <
          priceData.highest,
      );
      console.log(
        camelTradeOperation.entryOrdersStatus?.entryOrderOneTriggered,
      );

      console.log(
        !camelTradeOperation.takeProfitStatus?.takeProfitTwoTriggered,
      );

      if (camelTradeOperation.takeProfitTwo) {
        if (
          parseFloat(camelTradeOperation.takeProfitTwo as string) <
          priceData.highest
        ) {
          if (camelTradeOperation.entryOrdersStatus?.entryOrderOneTriggered) {
            if (!camelTradeOperation.takeProfitStatus?.takeProfitTwoTriggered) {
              camelTradeOperation.takeProfitStatus = {
                takeProfitOneTriggered: true,
                takeProfitTwoTriggered: true,
                takeProfitThreeTriggered: false,
              };

              camelTradeOperation.observation = 'Take profit 2';
              cronJobManagerService.stopJob(camelTradeOperation);

              UpdateTradeOperationService.execute(camelTradeOperation);
            }
          }
        }
      }
    }

    // --------- Logica para SORTs ---------

    if (camelTradeOperation.direction === 'short') {
      // Pegou Entry 1
      if (
        parseFloat(camelTradeOperation.entryOrderOne) < priceData.highest &&
        // PQ TA VINDO UNDEFINED
        !camelTradeOperation.entryOrdersStatus?.entryOrderOneTriggered
      ) {
        camelTradeOperation.entryOrdersStatus = {
          entryOrderOneTriggered: true,
          entryOrderTwoTriggered: false,
          entryOrderThreeTriggered: false,
        };

        camelTradeOperation.status = 'ativa';

        camelTradeOperation.observation = 'Pegou ordem 1';

        UpdateTradeOperationService.execute(camelTradeOperation);
      }

      // Pegou Entry 2
      if (
        parseFloat(camelTradeOperation.entryOrderTwo as string) <
          priceData.highest &&
        !camelTradeOperation.entryOrdersStatus?.entryOrderTwoTriggered
      ) {
        camelTradeOperation.entryOrdersStatus = {
          entryOrderOneTriggered: true,
          entryOrderTwoTriggered: true,
          entryOrderThreeTriggered: false,
        };

        camelTradeOperation.observation = 'Pegou ordem 2';

        UpdateTradeOperationService.execute(camelTradeOperation);
      }

      // Pegou Entry 3
      if (
        parseFloat(camelTradeOperation.entryOrderThree as string) <
          priceData.highest &&
        !camelTradeOperation.entryOrdersStatus?.entryOrderThreeTriggered
      ) {
        camelTradeOperation.entryOrdersStatus = {
          entryOrderOneTriggered: true,
          entryOrderTwoTriggered: true,
          entryOrderThreeTriggered: true,
        };

        camelTradeOperation.observation = 'Pegou ordem 3';

        UpdateTradeOperationService.execute(camelTradeOperation);
      }

      // PEGOU STOP
      if (parseFloat(camelTradeOperation.stop) < priceData.highest) {
        camelTradeOperation.status = 'fechada';
        camelTradeOperation.result = 'loss';

        UpdateTradeOperationService.execute(camelTradeOperation);
      }

      // PEGOU TP1 sem pegar entradas DELETAR OPERAÇÃO
      if (
        parseFloat(camelTradeOperation.takeProfitOne) < priceData.lowest &&
        !camelTradeOperation.entryOrdersStatus?.entryOrderOneTriggered
      ) {
        DeleteTradeOperationService.execute({
          id: camelTradeOperation.id,
        });
        cronJobManagerService.stopJob(camelTradeOperation);
      }

      // Pegou TP 1
      if (
        parseFloat(camelTradeOperation.takeProfitOne) > priceData.lowest &&
        camelTradeOperation.entryOrdersStatus?.entryOrderOneTriggered
      ) {
        camelTradeOperation.takeProfitStatus = {
          takeProfitOneTriggered: true,
          takeProfitTwoTriggered: false,
          takeProfitThreeTriggered: false,
        };

        camelTradeOperation.observation = 'Take profit 1';

        UpdateTradeOperationService.execute(camelTradeOperation);
      }

      // Pegou TP 2
      if (camelTradeOperation.takeProfitTwo) {
        if (
          parseFloat(camelTradeOperation.takeProfitTwo as string) >
          priceData.lowest
        ) {
          if (camelTradeOperation.entryOrdersStatus?.entryOrderOneTriggered) {
            if (!camelTradeOperation.takeProfitStatus?.takeProfitTwoTriggered) {
              camelTradeOperation.takeProfitStatus = {
                takeProfitOneTriggered: true,
                takeProfitTwoTriggered: true,
                takeProfitThreeTriggered: false,
              };

              camelTradeOperation.observation = 'Take profit 2';
              cronJobManagerService.stopJob(camelTradeOperation);

              UpdateTradeOperationService.execute(camelTradeOperation);
            }
          }
        }
      }
    }

    console.log('Checked operation success for: ', camelTradeOperation.market);
  }
}

export default CheckTradeTriggersService;
