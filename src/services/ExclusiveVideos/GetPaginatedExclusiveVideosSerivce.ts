import AppError from '../../errors/AppError';
import ExclusiveVideo from '../../models/ExclusiveVideo';
import exclusiveVideosRepository from '../../repositories/ExclusiveVideosRepository';
import { arrayToCamel } from '../../utils/responseToCamel';

interface QueryPayload {
  page: number;
  limit: number;
}

interface ExclusiveVideosResults {
  exclusiveVideos: ExclusiveVideo[];
  next: Object;
  previous: Object;
  totalPages: number;
}

class GetPaginatedExclusiveVideosService {
  public static async execute({
    page,
    limit,
  }: QueryPayload): Promise<ExclusiveVideosResults> {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const response = await exclusiveVideosRepository.paginatedExclusiveVideos(
      limit,
      startIndex,
    );

    if (!response) {
      throw new AppError('Unable to make exclusiveVideos query');
    }

    const exclusiveVideos = arrayToCamel(response[0]) as ExclusiveVideo[];
    const totalPosts = response[1];

    const results: ExclusiveVideosResults = {
      exclusiveVideos,
      next: {},
      previous: {},
      totalPages: Math.ceil(totalPosts / limit),
    };

    // Next page number and check if the posts has ended
    if (endIndex > exclusiveVideos.length && page * limit < totalPosts) {
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

export default GetPaginatedExclusiveVideosService;
