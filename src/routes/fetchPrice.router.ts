import { Router } from 'express';
import FetchPriceService from '../services/PriceFetcher/CheckPriceService';

const fetchPriceRouter = Router();

fetchPriceRouter.get('/', async (req, res) => {
  const response = await FetchPriceService.execute();

  return res.json({ response });
});

export default fetchPriceRouter;
