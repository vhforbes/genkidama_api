import { Router } from "express";
import PostsRepository from "../repositories/PostsRepository";
import CreatePostService from "../services/CreatePostService";

const postRouter = Router();
const postsRepository = new PostsRepository();

postRouter.get("/all", (req, res) => {
  const posts = postsRepository.all();
  res.json({ posts });
});

postRouter.post("/", (req, res) => {
  try {
    const { author, title, content } = req.body;

    const createPost = new CreatePostService(postsRepository);

    const post = createPost.execute({ author, title, content });

    return res.json(post);
  } catch (err) {
    return res.status(400);
  }
});

export default postRouter;
