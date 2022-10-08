import { Router } from "express";
import Post from "../models/Post";
import PostsRepository from "../repositories/PostsRepository";
import CreatePostService from "../services/CreatePostService";

const postsRouter = Router();
const postsRepository = PostsRepository;

postsRouter.get("/", async (req, res) => {
  const posts = await postsRepository.find();

  res.json({ posts });
});

postsRouter.post("/", async (req, res) => {
  try {
    const { user_id, title, content, image, video_link } = req.body;

    const createPost = new CreatePostService();

    const post = await createPost.execute({
      user_id,
      title,
      content,
      image,
      video_link,
    });

    console.log(post);

    return res.json(post);
  } catch (err) {
    return res.status(400);
  }
});

export default postsRouter;
