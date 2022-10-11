import { Router } from 'express';
import { ensureAutenticated } from '../middlewares/ensureAuthenticated';
import PostsRepository from '../repositories/PostsRepository';
import CreatePostService from '../services/CreatePostService';

const postsRouter = Router();
const postsRepository = PostsRepository;

postsRouter.use(ensureAutenticated);

postsRouter.get('/', async (req, res) => {
  const posts = await postsRepository.find();

  res.json({ posts });
});

postsRouter.post('/', async (req, res) => {
  const { authorId, title, content, image, videoLink } = req.body;

  const post = await CreatePostService.execute({
    author_id: authorId,
    title,
    content,
    image,
    video_link: videoLink,
  });

  return res.json(post);
});

export default postsRouter;
