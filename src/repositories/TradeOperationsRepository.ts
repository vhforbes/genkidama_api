import { AppDataSource } from '../data-source';
import TradeOperation from '../models/TradeOperation';
import { In } from 'typeorm'; // Import 'In' from TypeORM

interface Query {
  status?: string[];
  direction?: string;
}

const TradeOperationsRepository = AppDataSource.getRepository(
  TradeOperation,
).extend({
  async filteredOperations(
    filter: Query,
    pagination: any,
  ): Promise<[TradeOperation[], number] | null> {
    const whereCondition: any = {};

    // Since 'status' is always an array, use 'In' directly
    if (filter.status) {
      whereCondition.status = In(filter.status);
    }

    // Include other filters as needed
    if (filter.direction) {
      whereCondition.direction = filter.direction;
    }

    const tradeOperationsQueryResult = await this.findAndCount({
      where: whereCondition,
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
