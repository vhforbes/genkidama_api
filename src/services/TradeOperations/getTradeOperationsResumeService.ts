import { Between, IsNull, Not } from 'typeorm';
import { AppDataSource } from '../../data-source';
import TradeOperation from '../../models/TradeOperation';
import AppError from '../../errors/AppError';

interface TradeOperationsResume {
  totalOperations: number;
  gainPercentage: number;
  lossPercentage: number;
  evenPercentage: number;
  totalProfitPercentage: number;
}

interface TradeOperationResumeRequest {
  periodInDays: number;
}

class GetTradeOperationsResumeService {
  public static async execute({
    periodInDays,
  }: TradeOperationResumeRequest): Promise<TradeOperationsResume> {
    const tradeRepo = AppDataSource.getRepository(TradeOperation);

    if (!periodInDays) {
      throw new AppError('No period sent in payload');
    }

    // Calculate date from periodInDays ago till now
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - periodInDays);

    // Fetch all trade operations within this period
    const trades = await tradeRepo.find({
      where: [
        {
          updated_at: Between(fromDate, new Date()),
          status: 'fechada',
          result: Not(IsNull()),
        },
        {
          updated_at: Between(fromDate, new Date()),
          status: 'fechada',
          result: Not(''),
        },
      ],
    });

    const totalOperations = trades.length;

    console.log(trades);

    const gainOperations = trades.filter(
      trade => trade.result === 'gain',
    ).length;
    const lossOperations = trades.filter(
      trade => trade.result === 'loss',
    ).length;
    const evenOperations = trades.filter(
      trade => trade.result === 'even',
    ).length;

    console.log('GAIN: ', gainOperations);
    console.log('------------------------------');
    console.log('LOSS: ', lossOperations);
    console.log('------------------------------');
    console.log('EVEN: ', evenOperations);
    console.log('------------------------------');

    const gainPercentage = (gainOperations / totalOperations) * 100;
    const lossPercentage = (lossOperations / totalOperations) * 100;
    const evenPercentage = (evenOperations / totalOperations) * 100;

    const totalProfitPercentage = trades.reduce(
      (sum, trade) => sum + trade.percentual,
      0,
    );

    return {
      totalOperations,
      gainPercentage,
      lossPercentage,
      evenPercentage,
      totalProfitPercentage,
    };
  }
}

export default GetTradeOperationsResumeService;
