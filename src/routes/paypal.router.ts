import { Router } from 'express';

import CreateSubscriptionService from '../services/Subscriptions/CreateSubscription';

const paypalRouter = Router();

paypalRouter.post('/', async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { event_type, resource } = req.body;

  switch (event_type) {
    case 'BILLING.SUBSCRIPTION.ACTIVATED': {
      // "id": "I-BW452GLLEP1G" => Subscription identifier
      // "plan_id": "P-5ML4271244454362WXNWU5NQ",

      const user = await CreateSubscriptionService.execute({
        email: resource.subscriber.email_address,
        subscription_id: resource.id,
        plan_id: resource.plan_id,
      });

      res.json({ user: user });
      break;
    }

    case 'BILLING.SUBSCRIPTION.CANCELLED':
      console.log('CANCELED');

      break;

    case 'BILLING.SUBSCRIPTION.EXPIRED':
      console.log('EXPIRED');

      break;

    case 'BILLING.SUBSCRIPTION.RE-ACTIVATED':
      console.log('RE-ACTIVATED');

      break;

    default:
      break;
  }

  res.json({ ok: 'ok' });
});

export default paypalRouter;
