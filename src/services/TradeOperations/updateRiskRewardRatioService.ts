import { IsNull, Not } from 'typeorm';
import { AppDataSource } from '../../data-source';
import TradeOperation from '../../models/TradeOperation';

class UpdateRiskRewardRatioService {
  public static async execute(): Promise<{}> {
    const TradeOperationsRepository =
      AppDataSource.getRepository(TradeOperation);

    const TradeOperations = await TradeOperationsRepository.find({
      where: {
        percentual: Not(IsNull()),
        stopDistance: Not(IsNull()),
      },
    });

    TradeOperations.forEach(tradeOperation => {
      const tradeOperationToUpdate = tradeOperation;

      tradeOperationToUpdate.riskReturnRatio =
        tradeOperation.percentual / tradeOperation.stopDistance;
    });

    return {
      ok: 'ok',
    };
  }
}

export default UpdateRiskRewardRatioService;
