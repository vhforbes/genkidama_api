/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from 'express';
import AppError from '../errors/AppError';
import { TradeOperationInterface } from '../interfaces/TradeOperationInterface';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAutenticated } from '../middlewares/ensureAuthenticated';
import TradeOperationsRepository from '../repositories/TradeOperationsRepository';
import CreateTradeOperationService from '../services/TradeOperations/createTradeOperationService';
import GetActiveTradeoperationsService from '../services/TradeOperations/getFilteredOperationsService';
import UpdateTradeOperationService from '../services/TradeOperations/updateTradeOperationService';
import { arrayToCamel, objToCamel } from '../utils/responseToCamel';

const tradeOperationsRouter = Router();

tradeOperationsRouter.use(ensureAutenticated);

tradeOperationsRouter.get('/', async (req, res) => {
  const tradeOperationsRepository = TradeOperationsRepository;

  if (Object.keys(req.query).length !== 0) {
    // OPERATIONS WITH A QUERY
    const response = await GetActiveTradeoperationsService.execute(req.query);
    res.json(response);
  } else {
    // RETURN ALL THE OPERATIONS
    const tradeOperations = await tradeOperationsRepository.find({
      order: {
        updated_at: 'DESC',
      },
    });

    res.json(arrayToCamel(tradeOperations));
  }
});

tradeOperationsRouter.post('/', ensureAdmin, async (req, res) => {
  const request = req.body as TradeOperationInterface;

  const requestResult = await CreateTradeOperationService.execute(request);

  res.json(requestResult);
});

tradeOperationsRouter.put('/', ensureAdmin, async (req, res) => {
  const tradeOperation = req.body as TradeOperationInterface;

  const result = await UpdateTradeOperationService.execute(tradeOperation);

  res.json(objToCamel(result));
});

tradeOperationsRouter.delete('/', ensureAdmin, async (req, res) => {
  const tradeOperationsRepository = TradeOperationsRepository;

  const { id } = req.query;

  const tradeOperation = await tradeOperationsRepository.findOne({
    where: {
      id: id as string,
    },
  });

  if (!tradeOperation) {
    throw new AppError('Could not find trade operation to delete');
  }

  const result = await tradeOperationsRepository.remove(tradeOperation);

  result.id = id as string;

  res.json(objToCamel(result));
});

export default tradeOperationsRouter;
