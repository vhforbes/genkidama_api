import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';

import Subscription from '../../models/Subscription';

interface Request {
  paypalSubscriptionId: string;
  current_period_end: string;
}

class UpdateSubscriptionService {
  public static async execute({
    paypalSubscriptionId,
    current_period_end,
  }: Request): Promise<{}> {
    const subscriptionRepository = AppDataSource.getRepository(Subscription);

    const subscription = await subscriptionRepository.findOne({
      where: { paypal_subscription_id: paypalSubscriptionId },
    });

    if (!subscription) {
      throw new AppError('Subscription was not found');
    }

    subscription.current_period_end = current_period_end;

    return {
      canceledSubscription: subscription,
    };
  }
}

export default UpdateSubscriptionService;
