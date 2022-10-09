import { AppDataSource } from "../data-source";
import Post from "../models/Post";

interface Request {
  author_id: string;
  title: string;
  content: string;
  image: string;
  video_link: string;
}

class CreatePostService {
  public async execute({
    title,
    author_id,
    content,
    image,
    video_link,
  }: Request): Promise<Post | null> {
    const postsRepository = AppDataSource.getRepository(Post);

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
