import { PayloadTradeOperationInterface } from '../../interfaces/TradeOperationInterface';
import AppError from '../../errors/AppError';
import TradeOperationsRepository from '../../repositories/TradeOperationsRepository';
import { arrayToCamel } from '../../utils/responseToCamel';

interface Request {
  status?: string | string[];
  direction?: string;
  page?: string;
  limit?: string;
}

interface TradeOperationsResults {
  tradeOperations: PayloadTradeOperationInterface[];
  next: Object;
  previous: Object;
  totalPages: number;
}

interface Pagination {
  take: number;
  skip: number;
}

class GetFilteredTradeOperationsService {
  public static async execute(
    query: Request,
  ): Promise<TradeOperationsResults | null> {
    let pagination = {} as Pagination;
    let page = 1;
    let limit = 1;
    let startIndex = 1;
    let endIndex = 1;

    if (query.page && query.limit) {
      page = parseInt(query.page as string, 10);
      limit = parseInt(query.limit as string, 10);

      startIndex = (page - 1) * limit;
      endIndex = page * limit;

      pagination = {
        take: limit,
        skip: startIndex,
      };
    }

    let filter: any = {};

    if (query.status) {
      if (Array.isArray(query.status)) {
        filter.status = query.status;
      } else {
        filter.status = [query.status];
      }
    }

    if (query.direction) {
      filter.direction = query.direction;
    }

    const response = await TradeOperationsRepository.filteredOperations(
      filter,
      pagination,
    );

    if (!response) {
      throw new AppError('Unable to make trade operations query');
    }

    const tradeOperations = arrayToCamel(
      response[0],
    ) as PayloadTradeOperationInterface[];
    const totalTradeOperations = response[1];

    const results: TradeOperationsResults = {
      tradeOperations,
      next: {},
      previous: {},
      totalPages: Math.ceil(totalTradeOperations / limit),
    };

    // Next page number and check if the posts has ended
    if (
      endIndex > tradeOperations.length &&
      page * limit < totalTradeOperations
    ) {
      results.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit,
      };
    }

    return results;
  }
}

export default GetFilteredTradeOperationsService;
