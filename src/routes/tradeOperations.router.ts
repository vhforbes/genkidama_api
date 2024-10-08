/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from 'express';
import { PayloadTradeOperationInterface } from '../interfaces/TradeOperationInterface';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import { ensureAutenticated } from '../middlewares/ensureAuthenticated';
import TradeOperationsRepository from '../repositories/TradeOperationsRepository';
import CreateTradeOperationService from '../services/TradeOperations/createTradeOperationService';
import GetActiveTradeoperationsService from '../services/TradeOperations/getFilteredOperationsService';
import UpdateTradeOperationService from '../services/TradeOperations/updateTradeOperationService';
import { arrayToCamel, objToCamel } from '../utils/responseToCamel';
import AddUserToTradeOperation from '../services/TradeOperations/follow/addUserToTradeOperationService';
import AddTradeOperationToUser from '../services/TradeOperations/follow/addTradeOperationToUser';
import GetTradeOperationHistory from '../services/TradeOperationHistory/getTradeOperationHistory';
import RemoveUserFromTradeOperation from '../services/TradeOperations/follow/removeUserFromTradeOperationService';
import RemoveTradeOperationFromUser from '../services/TradeOperations/follow/removeTradeOperationFromUserService';
import DeleteTradeOperationService from '../services/TradeOperations/deleteTradeOperationService';
import GetTradeOperationsResumeService from '../services/TradeOperations/getTradeOperationsResumeService';
import ListTradeOperationsService from '../services/TradeOperations/listTradeOperationsService';
import UpdateRiskRewardRatioService from '../services/TradeOperations/updateRiskRewardRatioService';

const tradeOperationsRouter = Router();

// tradeOperationsRouter.use(ensureAutenticated);

tradeOperationsRouter.get('/', ensureAutenticated, async (req, res) => {
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
      relations: ['users'],
    });

    res.json(arrayToCamel(tradeOperations));
  }
});

tradeOperationsRouter.post(
  '/',
  ensureAutenticated,
  ensureAdmin,
  async (req, res) => {
    const request = req.body as PayloadTradeOperationInterface;

    request.authorId = req.user.id;

    const requestResult = await CreateTradeOperationService.execute(request);

    res.json(requestResult);
  },
);

tradeOperationsRouter.put(
  '/',
  ensureAutenticated,
  ensureAdmin,
  async (req, res) => {
    const tradeOperation = req.body as PayloadTradeOperationInterface;

    const result = await UpdateTradeOperationService.execute(tradeOperation);

    res.json(objToCamel(result));
  },
);

tradeOperationsRouter.delete(
  '/',
  ensureAutenticated,
  ensureAdmin,
  async (req, res) => {
    const { id } = req.query;

    const result = await DeleteTradeOperationService.execute({
      id: id as string,
    });

    res.json(objToCamel(result));
  },
);

tradeOperationsRouter.post('/follow', ensureAutenticated, async (req, res) => {
  const request = req.body as { userId: string; tradeOperationId: string };

  const tradeOperation = await AddUserToTradeOperation.execute(
    req.user.id,
    request.tradeOperationId,
  );

  const user = await AddTradeOperationToUser.execute(
    req.user.id,
    request.tradeOperationId,
  );

  res.json({ tradeOperation, user });
});

tradeOperationsRouter.post(
  '/unfollow',
  ensureAutenticated,
  async (req, res) => {
    const request = req.body as { userId: string; tradeOperationId: string };

    const tradeOperation = await RemoveUserFromTradeOperation.execute(
      req.user.id,
      request.tradeOperationId,
    );

    const user = await RemoveTradeOperationFromUser.execute(
      req.user.id,
      request.tradeOperationId,
    );

    res.json({ tradeOperation, user });
  },
);

tradeOperationsRouter.get('/history', ensureAutenticated, async (req, res) => {
  const { id } = req.query;

  const requestResult = await GetTradeOperationHistory.execute(id as string);

  res.json(requestResult);
});

tradeOperationsRouter.get('/resume', async (req, res) => {
  const { period } = req.query;

  const requestResult = await GetTradeOperationsResumeService.execute({
    periodInDays: parseInt(period as string, 10),
  });

  res.json(requestResult);
});

tradeOperationsRouter.get('/list', async (req, res) => {
  const requestResult = await ListTradeOperationsService.execute();

  res.json(requestResult);
});

tradeOperationsRouter.post('/updateRiskReturnRatio', async (req, res) => {
  const resp = await UpdateRiskRewardRatioService.execute();

  res.json(resp);
});

export default tradeOperationsRouter;
