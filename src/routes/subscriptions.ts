/* eslint-disable @typescript-eslint/naming-convention */
import { Router } from 'express';
import { ensureAutenticated } from '../middlewares/ensureAuthenticated';
import CancelSubscriptionService from '../services/Subscriptions/CancelSubscriptionService';
import CreateSubscriptionService from '../services/Subscriptions/CreatePaypalSubscriptionService';
import SubscriptionStatusService from '../services/Subscriptions/SubscriptionStatusService';
import CreateManualSubscriptionService from '../services/Subscriptions/CreateManualSubscriptionService';
import { ensureAdmin } from '../middlewares/ensureAdmin';
import UpdateSubscriptionService from '../services/Subscriptions/UpdateSubscriptionService';
import Subscription from '../models/Subscription';

const subscriptionsRouter = Router();

subscriptionsRouter.get('/status', ensureAutenticated, async (req, res) => {
  const userId = req.user.id;

  const subscriptionStatus = await SubscriptionStatusService.execute({
    userId,
  });

  res.json(subscriptionStatus);
});

subscriptionsRouter.put(
  '/update/:id',
  ensureAutenticated,
  ensureAdmin,
  async (req, res) => {
    const updatedSubscription = await UpdateSubscriptionService.execute(
      req.body as Subscription,
    );
    res.json(updatedSubscription);
  },
);

subscriptionsRouter.post(
  '/createPayapalSubscription',
  ensureAutenticated,
  async (req, res) => {
    const { email, subscriptionID } = req.body;

    const createdSubscription = await CreateSubscriptionService.execute({
      email,
      subscriptionID,
    });

    return res.json(createdSubscription);
  },
);

subscriptionsRouter.post(
  '/createManualSubscription',
  ensureAutenticated,
  ensureAdmin,
  async (req, res) => {
    const { email, type, current_period_end } = req.body;

    const createdSubscription = await CreateManualSubscriptionService.execute({
      email,
      type,
      current_period_end,
    });

    return res.json(createdSubscription);
  },
);

subscriptionsRouter.post('/cancel', ensureAutenticated, async (req, res) => {
  const { cancelationReason } = req.body;

  const userId = req.user.id;

  const canceledSubscription = await CancelSubscriptionService.execute({
    userId,
    cancelationReason: cancelationReason as string,
  });

  return res.json(canceledSubscription);
});

export default subscriptionsRouter;
