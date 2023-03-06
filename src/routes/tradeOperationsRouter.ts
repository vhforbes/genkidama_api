/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from 'express';
import { AppDataSource } from '../data-source';
import AppError from '../errors/AppError';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAutenticated } from '../middlewares/ensureAuthenticated';
import TradeOperation from '../models/TradeOperation';
import CreateTradeOperationService from '../services/TradeOperations/createTradeOperationService';
import GetActiveTradeoperationsService from '../services/TradeOperations/getFilteredOperationsService';
import UpdateTradeOperationService from '../services/TradeOperations/updateTradeOperationService';

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
    entry_order_one,
    entry_order_two,
    entry_order_three,
    take_profit_one,
    take_profit_two,
    stop,
    result,
  } = req.body;

  const requestResult = await CreateTradeOperationService.execute({
    author_id: req.user.id,
    market,
    active,
    direction,
    entry_order_one,
    entry_order_two,
    entry_order_three,
    take_profit_one,
    take_profit_two,
    stop,
    result,
  });

  res.json(requestResult);
});

tradeOperationsRouter.put('/update', ensureAdmin, async (req, res) => {
  const {
    id,
    market,
    active,
    direction,
    entry_order_one,
    entry_order_two,
    entry_order_three,
    take_profit_one,
    take_profit_two,
    stop,
    result,
  } = req.body;

  const response = await UpdateTradeOperationService.execute({
    id,
    market,
    active,
    direction,
    entry_order_one,
    entry_order_two,
    entry_order_three,
    take_profit_one,
    take_profit_two,
    stop,
    result,
  });

  res.json(response);
});

tradeOperationsRouter.delete('/:operationId', ensureAdmin, async (req, res) => {
  const tradeOperationsRepository = AppDataSource.getRepository(TradeOperation);

  const { operationId } = req.query;

  const tradeOperation = await tradeOperationsRepository.findOne({
    where: {
      id: operationId as string,
    },
  });

  if (!tradeOperation) {
    throw new AppError('Could not find trade operation to delete');
  }

  const result = await tradeOperationsRepository.remove(tradeOperation);

  res.json(result);
});

export default tradeOperationsRouter;
