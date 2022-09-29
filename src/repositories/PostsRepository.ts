import { AppDataSource } from "../data-source";
import Post from "../models/Post";

const PostsRepository = AppDataSource.getRepository(Post);

export default PostsRepository;
