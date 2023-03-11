/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from 'express';
import AppError from '../errors/AppError';
import { ExclusiveVideoInterface } from '../interfaces/ExclusiveVideoInterface';

import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAutenticated } from '../middlewares/ensureAuthenticated';

import ExclusiveVideosRepository from '../repositories/ExclusiveVideosRepository';

import CreateExclsiveVideoService from '../services/ExclusiveVideos/CreateExclusiveVideoService';
import GetPaginatedPostsService from '../services/ExclusiveVideos/GetPaginatedExclusiveVideosSerivce';
import UpdateExclusiveVideoService from '../services/ExclusiveVideos/UpdateExclusiveVideoService';
import { responseToCamel } from '../utils/responseToCamel';

const exclusiveVideoRouter = Router();

exclusiveVideoRouter.use(ensureAutenticated);

exclusiveVideoRouter.get('/', async (req, res) => {
  // If there is no query params return all posts
  if (!req.query.page || !req.query.limit) {
    const response = await ExclusiveVideosRepository.find();
    const camelizedRes = responseToCamel(response);
    res.json(camelizedRes);
  }

  if (req.query.page && req.query.limit) {
    const page = parseInt(req.query.page as string, 10);
    const limit = parseInt(req.query.limit as string, 10);

    const response = await GetPaginatedPostsService.execute({ page, limit });

    res.json(response);
  }
});

exclusiveVideoRouter.post('/', ensureAdmin, async (req, res) => {
  const exclusiveVideo = req.body as ExclusiveVideoInterface;

  exclusiveVideo.authorId = req.user.id;

  const post = await CreateExclsiveVideoService.execute(exclusiveVideo);

  return res.json(post);
});

exclusiveVideoRouter.put('/', ensureAdmin, async (req, res) => {
  const { id, title, content, image, videoLink } = req.body;

  const post = await UpdateExclusiveVideoService.execute({
    id,
    title,
    content,
    image,
    video_link: videoLink,
  });

  return res.json(post);
});

exclusiveVideoRouter.delete('/:id', ensureAdmin, async (req, res) => {
  const exclusiveVideosRepository = ExclusiveVideosRepository;

  const { id } = req.params;

  const exclusiveVideo = await exclusiveVideosRepository.findOne({
    where: {
      id,
    },
  });

  if (!exclusiveVideo) {
    throw new AppError('Could not find exclusive video to delete');
  }

  const result = await exclusiveVideosRepository.remove(exclusiveVideo);

  return res.json(result);
});

export default exclusiveVideoRouter;
