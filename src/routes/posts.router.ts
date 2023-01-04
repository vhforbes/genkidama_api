import { Router } from 'express';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAutenticated } from '../middlewares/ensureAuthenticated';
import PostsRepository from '../repositories/PostsRepository';
import CreatePostService from '../services/Posts/CreatePostService';
import GetPaginatedPostsService from '../services/Posts/GetPaginatedPostsSerivce';

const postsRouter = Router();

postsRouter.use(ensureAutenticated);

postsRouter.get('/', async (req, res) => {
  // If there is no query params return all posts
  if (!req.query.page || !req.query.limit) {
    const response = await PostsRepository.find();
    res.json({ response });
  }

  if (req.query.page && req.query.limit) {
    const page = parseInt(req.query.page as string, 10);
    const limit = parseInt(req.query.limit as string, 10);

    const response = await GetPaginatedPostsService.execute({ page, limit });

    res.json(response);
  }
});

postsRouter.post('/', ensureAdmin, async (req, res) => {
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
