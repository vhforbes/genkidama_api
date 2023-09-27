import { AppDataSource } from '../data-source';
import TradeOperation from '../models/TradeOperation';

interface Request {
  status?: string;
  direction?: string;
}

const TradeOperationsRepository = AppDataSource.getRepository(
  TradeOperation,
).extend({
  async filteredOperations(
    filter: Request,
    pagination: any,
  ): Promise<[TradeOperation[], number] | null> {
    const tradeOperationsQueryResult = await this.findAndCount({
      where: filter,
      order: {
        created_at: 'DESC',
      },
      take: pagination.take,
      skip: pagination.skip,
    });

    return tradeOperationsQueryResult;
  },
});

export default TradeOperationsRepository;
