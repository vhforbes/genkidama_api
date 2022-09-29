import Post from "../models/Post";

interface CreatePostDTO {
  author: string;
  title: string;
  content: string;
}

class PostsRepository {
  private posts: Post[];

  constructor() {
    this.posts = [];
  }

  public all(): Post[] {
    return this.posts;
  }

  public create({ author, title, content }: CreatePostDTO): Post {
    const post = new Post({ author, title, content });

    this.posts.push(post);

    return post;
  }
}

export default PostsRepository;
