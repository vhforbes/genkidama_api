import { AppDataSource } from '../data-source';
import TradeOperation from '../models/TradeOperation';

interface Request {
  active: boolean;
  direction: string;
}

const TradeOperationsRepository = AppDataSource.getRepository(
  TradeOperation,
).extend({
  async filteredOperations(query: Request): Promise<TradeOperation[] | null> {
    const tradeOperationsQueryResult = await this.find({
      where: query,
    });

    return tradeOperationsQueryResult;
  },
});

export default TradeOperationsRepository;
