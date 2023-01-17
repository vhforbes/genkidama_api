import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';
import Post from '../../models/Post';

interface Request {
  id: string;
  title: string;
  content: string;
  image: string;
  video_link: string;
}

class UpdatePostService {
  public static async execute({
    id,
    title,
    content,
    image,
    video_link,
  }: Request): Promise<Post | null> {
    const postsRepository = AppDataSource.getRepository(Post);

    const postToUpdate = await postsRepository.findOne({
      where: { id },
    });

    if (!postToUpdate) {
      throw new AppError('Post not found');
    }

    const updatedPost = postsRepository.save({
      id,
      title,
      content,
      image,
      video_link,
    });

    return updatedPost;
  }
}

export default UpdatePostService;
