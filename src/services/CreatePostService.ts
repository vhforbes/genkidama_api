import { AppDataSource } from "../data-source";
import Post from "../models/Post";

interface Request {
  user_id: string;
  title: string;
  content: string;
  image: string;
  video_link: string;
}

class CreatePostService {
  public async execute({
    title,
    user_id,
    content,
    image,
    video_link,
  }: Request): Promise<Post> {
    const postsRepository = AppDataSource.getRepository(Post);

    const post = postsRepository.create({
      user_id,
      title,
      content,
      image,
      video_link,
    });

    try {
      const results = await postsRepository.save(post);
      return results;
    } catch (error) {
      console.log(error);
    }
  }
}

export default CreatePostService;
