import Post from "../models/Post";
import PostsRepository from "../repositories/PostsRepository";

interface Request {
  title: string;
  author: string;
  content: string;
  image: string;
  video: string;
}

class CreatePostService {
  private postsRepository = PostsRepository;

  public async execute({
    title,
    author,
    content,
    image,
    video,
  }: Request): Promise<Post> {
    const post = this.postsRepository.create({
      date: new Date(),
      title,
      author,
      content,
      image,
      video,
    });

    const results = await this.postsRepository.save(post);

    return results;
  }
}

export default CreatePostService;
