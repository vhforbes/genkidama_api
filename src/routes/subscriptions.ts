import { Router } from 'express';
import { ensureAutenticated } from '../middlewares/ensureAuthenticated';
import CancelSubscriptionService from '../services/Subscriptions/CancelSubscriptionService';
import CreateSubscriptionService from '../services/Subscriptions/CreatePaypalSubscriptionService';
import SubscriptionStatusService from '../services/Subscriptions/SubscriptionStatusService';
import CreateManualSubscriptionService from '../services/Subscriptions/CreateManualSubscriptionService';
import { ensureAdmin } from '../middlewares/ensureAdmin';

const subscriptionsRouter = Router();

subscriptionsRouter.get('/status', ensureAutenticated, async (req, res) => {
  const userId = req.user.id;

  const subscriptionStatus = await SubscriptionStatusService.execute({
    userId,
  });

  res.json(subscriptionStatus);
});

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
    const { email, type, endDate, lifetime } = req.body;

    const createdSubscription = await CreateManualSubscriptionService.execute({
      email,
      type,
      endDate,
      lifetime,
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
