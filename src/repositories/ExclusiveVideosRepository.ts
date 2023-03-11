import { AppDataSource } from '../data-source';
import ExclusiveVideo from '../models/ExclusiveVideo';

const ExclusiveVideosRepository = AppDataSource.getRepository(
  ExclusiveVideo,
).extend({
  async paginatedPosts(
    take: number,
    skip: number,
  ): Promise<[ExclusiveVideo[], number] | null> {
    const exclusiveVideosResults = await this.findAndCount({
      order: {
        created_at: 'DESC',
      },
      take,
      skip,
    });

    return exclusiveVideosResults;
  },
});

export default ExclusiveVideosRepository;
