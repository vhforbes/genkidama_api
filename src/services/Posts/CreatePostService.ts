import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';
import Post from '../../models/Post';
import User from '../../models/User';

interface Request {
  author_id: string;
  title: string;
  content: string;
  image: string;
  video_link: string;
}

class CreatePostService {
  public static async execute({
    title,
    author_id,
    content,
    image,
    video_link,
  }: Request): Promise<Post | null> {
    const postsRepository = AppDataSource.getRepository(Post);
    const usersRepository = AppDataSource.getRepository(User);

    const user = await usersRepository.findOne({
      where: { id: author_id },
    });

    if (!user) {
      throw new AppError('Unable to create post: User not found');
    }

    const post = postsRepository.create({
      author_id: author_id,
      title,
      content,
      image,
      video_link,
    });

    const results = await postsRepository.save(post);
    return results;
  }
}

export default CreatePostService;
