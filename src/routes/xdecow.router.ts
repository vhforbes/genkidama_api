import { Router } from 'express';

import { ensureAutenticated } from '../middlewares/ensureAuthenticated';
import GetXdecowDataService from '../services/Xdecow/GetXdecowDataService';

const xdecowRouter = Router();

xdecowRouter.get('/', ensureAutenticated, async (req, res) => {
  const xdecowData = await GetXdecowDataService.execute();

  return res.json(xdecowData);
});

export default xdecowRouter;
