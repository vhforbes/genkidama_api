import Post from "../models/Post";
import PostsRepository from "../repositories/PostsRepository";

interface Request {
  title: string;
  author: string;
  content: string;
}

class CreatePostService {
  private postsRepository: PostsRepository;

  constructor(postsRepository: PostsRepository) {
    this.postsRepository = postsRepository;
  }

  public execute({ title, author, content }: Request): Post {
    // Regras (ifs) que impediriam de criarmos um post vao aqui

    const post = this.postsRepository.create({
      title,
      author,
      content,
    });

    return post;
  }
}

export default CreatePostService;
