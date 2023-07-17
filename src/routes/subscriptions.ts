import { Router } from 'express';
import { ensureAutenticated } from '../middlewares/ensureAuthenticated';
import CancelSubscriptionService from '../services/Subscriptions/CancelSubscriptionService';
import CreateSubscriptionService from '../services/Subscriptions/CreateSubscriptionService';
import SubscriptionStatusService from '../services/Subscriptions/SubscriptionStatusService';

const subscriptionsRouter = Router();

subscriptionsRouter.get('/status', ensureAutenticated, async (req, res) => {
  const userId = req.user.id;

  const subscriptionStatus = await SubscriptionStatusService.execute({
    userId,
  });

  res.json(subscriptionStatus);
});

subscriptionsRouter.post('/create', ensureAutenticated, async (req, res) => {
  const { email, subscriptionID } = req.body;

  const createdSubscription = await CreateSubscriptionService.execute({
    email,
    subscriptionID,
  });

  return res.json(createdSubscription);
});

subscriptionsRouter.post('/cancel', ensureAutenticated, async (req, res) => {
  const { paypalSubscriptionId, cancelationReason } = req.body;

  console.log('PAYPALSUBID: ', paypalSubscriptionId);

  const userId = req.user.id;

  const canceledSubscription = await CancelSubscriptionService.execute({
    userId,
    paypalSubscriptionId: paypalSubscriptionId as string,
    cancelationReason: cancelationReason as string,
  });

  return res.json(canceledSubscription);
});

export default subscriptionsRouter;
