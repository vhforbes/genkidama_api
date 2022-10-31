import { AppDataSource } from '../data-source';
import Post from '../models/Post';

const PostsRepository = AppDataSource.getRepository(Post).extend({
  async paginatedPosts(
    take: number,
    skip: number,
  ): Promise<[Post[], number] | null> {
    const postsResults = await this.findAndCount({
      order: {
        created_at: 'DESC',
      },
      take,
      skip,
    });

    return postsResults;
  },
});

export default PostsRepository;
