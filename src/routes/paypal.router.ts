import { Router } from 'express';
import AppError from '../errors/AppError';
import CancelSubscriptionService from '../services/Subscriptions/CancelSubscriptionService';
import UpdateSubscriptionService from '../services/Subscriptions/UpdateSubscriptionService';

const paypalRouter = Router();

paypalRouter.post('/', async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { event_type, resource } = req.body;

  let serviceResponse = null;

  console.log(resource);

  switch (event_type) {
    case 'BILLING.SUBSCRIPTION.CANCELLED':
      // serviceResponse = await CancelSubscriptionService.execute({
      //   paypalSubscriptionId: resource.id,
      // });

      console.log(resource);

      break;

    case 'BILLING.SUBSCRIPTION.EXPIRED':
      // serviceResponse = await CancelSubscriptionService.execute({
      //   paypalSubscriptionId: resource.id,
      // });

      break;

    case 'BILLING.SUBSCRIPTION.UPDATED':
      // serviceResponse = await UpdateSubscriptionService.execute({
      //   paypalSubscriptionId: resource.id,
      //   current_period_end: resource.final_payment_due_date,
      // });

      break;

    case 'BILLING.SUBSCRIPTION.RE-ACTIVATED':
      // serviceResponse = await UpdateSubscriptionService.execute({
      //   paypalSubscriptionId: resource.id,
      //   current_period_end: resource.final_payment_due_date,
      // });

      break;

    default:
      throw new AppError(`Webhhok event ${event_type} not mapped`, 200);
  }

  res.json({ serviceResponse });
});

export default paypalRouter;
