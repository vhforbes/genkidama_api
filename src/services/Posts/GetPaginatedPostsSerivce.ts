import AppError from '../../errors/AppError';
import Post from '../../models/Post';
import PostsRepository from '../../repositories/PostsRepository';

interface QueryPayload {
  page: number;
  limit: number;
}

interface PostsResults {
  posts: Post[];
  next: Object;
  previous: Object;
  totalPages: number;
}

class GetPaginatedPostsService {
  public static async execute({
    page,
    limit,
  }: QueryPayload): Promise<PostsResults> {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const response = await PostsRepository.paginatedPosts(limit, startIndex);

    if (!response) {
      throw new AppError('Unable to make posts query');
    }

    const posts = response[0];
    const totalPosts = response[1];

    if (posts.length < 1) {
      throw new AppError('There are no more posts to be fetched');
    }

    const results: PostsResults = {
      posts,
      next: {},
      previous: {},
      totalPages: Math.ceil(totalPosts / limit),
    };

    // Next page number and check if the posts has ended
    if (endIndex > posts.length && page * limit < totalPosts) {
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

export default GetPaginatedPostsService;
