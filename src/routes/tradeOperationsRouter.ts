import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAutenticated } from '../middlewares/ensureAuthenticated';
import TradeOperation from '../models/TradeOperation';
import CreateTradeOperationService from '../services/TradeOperations/createTradeOperationService';

const tradeOperationsRouter = Router();

tradeOperationsRouter.use(ensureAutenticated);

tradeOperationsRouter.get('/', async (req, res) => {
  const tradeOperationsRepository = AppDataSource.getRepository(TradeOperation);
  const tradeOperations = await tradeOperationsRepository.find();

  res.json(tradeOperations);
});

tradeOperationsRouter.post('/create', ensureAdmin, async (req, res) => {
  const { market, active, direction, entryZoneStart, entryZoneEnd, stop } =
    req.body;

  const result = await CreateTradeOperationService.execute({
    authorId: req.user.id,
    market,
    active,
    direction,
    entryZoneStart,
    entryZoneEnd,
    stop,
  });

  res.json(result);
});

export default tradeOperationsRouter;
