import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAutenticated } from '../middlewares/ensureAuthenticated';
import BitgetUID from '../models/BitgetAssociatedUids';
import UpdateBitgetAssociateService from '../services/Exchanges/UpdatedBitgetAssociatesService';

const bitgetRouter = Router();

bitgetRouter.use(ensureAutenticated);

bitgetRouter.post('/associated', ensureAdmin, async (req, res) => {
  const { uidList } = req.body;

  await UpdateBitgetAssociateService.execute({ uidList });

  return res.json({ result: 'List updated' });
});

bitgetRouter.get('/associated', ensureAdmin, async (req, res) => {
  const bitgetUIDRepository = AppDataSource.getRepository(BitgetUID);

  const reponse = await bitgetUIDRepository.find();

  res.send(reponse);
});

export default bitgetRouter;
