import TradeOperation from '../../models/TradeOperation';
import TradeOperationsRepository from '../../repositories/TradeOperationsRepository';

interface Request {
  active?: boolean;
  direction?: string;
}

class GetFilteredTradeOperationsService {
  public static async execute(
    query: Request,
  ): Promise<TradeOperation[] | null> {
    const results = await TradeOperationsRepository.filteredOperations(query);
    return results;
  }
}

export default GetFilteredTradeOperationsService;
