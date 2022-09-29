import { Router } from "express";
import Post from "../models/Post";
import PostsRepository from "../repositories/PostsRepository";
import CreatePostService from "../services/CreatePostService";

const postRouter = Router();
const postsRepository = PostsRepository;

postRouter.get("/all", async (req, res) => {
  const posts = await postsRepository.find();

  res.json({ posts });
});

postRouter.post("/", async (req, res) => {
  try {
    const { author, title, content, image, video } = req.body;

    const createPost = new CreatePostService();

    const post = await createPost.execute({
      author,
      title,
      content,
      image,
      video,
    });

    return res.json(post);
  } catch (err) {
    return res.status(400);
  }
});

export default postRouter;
