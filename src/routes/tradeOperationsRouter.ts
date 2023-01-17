import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAutenticated } from '../middlewares/ensureAuthenticated';
import TradeOperation from '../models/TradeOperation';
import CreateTradeOperationService from '../services/TradeOperations/CreateTradeOperationService';
import GetActiveTradeoperationsService from '../services/TradeOperations/GetFilteredOperationsService';
import UpdateTradeOperationService from '../services/TradeOperations/UpdateTradeOperationService';

const tradeOperationsRouter = Router();

tradeOperationsRouter.use(ensureAutenticated);

tradeOperationsRouter.get('/', async (req, res) => {
  const tradeOperationsRepository = AppDataSource.getRepository(TradeOperation);

  if (Object.keys(req.query).length !== 0) {
    const response = await GetActiveTradeoperationsService.execute(req.query);

    res.json(response);
  } else {
    const tradeOperations = await tradeOperationsRepository.find({
      order: {
        updated_at: 'DESC',
      },
    });
    res.json(tradeOperations);
  }
});

tradeOperationsRouter.post('/create', ensureAdmin, async (req, res) => {
  const {
    market,
    active,
    direction,
    entryOrderOne,
    entryOrderTwo,
    entryOrderThree,
    takeProfitOne,
    takeProfitTwo,
    stop,
  } = req.body;

  const result = await CreateTradeOperationService.execute({
    userId: req.user.id,
    market,
    active,
    direction,
    entryOrderOne,
    entryOrderTwo,
    entryOrderThree,
    takeProfitOne,
    takeProfitTwo,
    stop,
  });

  res.json(result);
});

tradeOperationsRouter.put('/update', ensureAdmin, async (req, res) => {
  const {
    id,
    market,
    active,
    direction,
    entryOrderOne,
    entryOrderTwo,
    entryOrderThree,
    takeProfitOne,
    takeProfitTwo,
    stop,
    result,
  } = req.body;

  const response = await UpdateTradeOperationService.execute({
    id,
    market,
    active,
    direction,
    entry_order_one: entryOrderOne,
    entry_order_two: entryOrderTwo,
    entry_order_three: entryOrderThree,
    take_profit_one: takeProfitOne,
    take_profit_two: takeProfitTwo,
    stop,
    result,
  });

  res.json(response);
});

export default tradeOperationsRouter;
