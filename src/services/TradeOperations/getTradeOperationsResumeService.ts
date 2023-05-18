import { Between } from 'typeorm';
import { AppDataSource } from '../../data-source';
import TradeOperation from '../../models/TradeOperation';
import AppError from '../../errors/AppError';

interface TradeOperationsResume {
  totalOperations: number;
  gainPercentage: number;
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
      where: {
        created_at: Between(fromDate, new Date()),
      },
    });

    const totalOperations = trades.length;

    const gainOperations = trades.filter(
      trade => trade.result === 'gain',
    ).length;
    const gainPercentage = (gainOperations / totalOperations) * 100;

    const totalProfitPercentage = trades.reduce(
      (sum, trade) => sum + trade.percentual,
      0,
    );

    return {
      totalOperations,
      gainPercentage,
      totalProfitPercentage,
    };
  }
}

export default GetTradeOperationsResumeService;
