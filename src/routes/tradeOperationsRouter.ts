import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAutenticated } from '../middlewares/ensureAuthenticated';
import TradeOperation from '../models/TradeOperation';
import CreateTradeOperationService from '../services/TradeOperations/createTradeOperationService';
import GetActiveTradeoperationsService from '../services/TradeOperations/getFilteredOperationsService';

const tradeOperationsRouter = Router();

tradeOperationsRouter.use(ensureAutenticated);

tradeOperationsRouter.get('/', async (req, res) => {
  const tradeOperationsRepository = AppDataSource.getRepository(TradeOperation);

  if (Object.keys(req.query).length !== 0) {
    const response = await GetActiveTradeoperationsService.execute({
      active: req.query.active === 'true',
      direction: req.query.direction as string,
    });

    res.json(response);
  } else {
    const tradeOperations = await tradeOperationsRepository.find();
    res.json(tradeOperations);
  }
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
