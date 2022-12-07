import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';

import Subscription from '../../models/Subscription';

import paypalPrivateApi from '../../apis/paypalPrivateApi';

interface Request {
  paypalSubscriptionId: string;
  cancelationReason: string;
}

/*
  [] Receive webhook
  [] Validate webhook validity
  [] Sort event type
  [] Create or Update Subscription
*/

class CancelSubscriptionService {
  public static async execute({
    paypalSubscriptionId,
    cancelationReason,
  }: Request): Promise<{}> {
    const subscriptionRepository = AppDataSource.getRepository(Subscription);

    const subscription = await subscriptionRepository.findOne({
      where: { paypal_subscription_id: paypalSubscriptionId },
    });

    if (!subscription) {
      throw new AppError('Subscription was not found');
    }

    if (subscription.status !== 'ACTIVE') {
      throw new AppError('Not a active subscription');
    }

    if (subscription.status === 'ACTIVE') {
      const cancelResponse = await paypalPrivateApi.post(
        `/billing/subscriptions/${subscription.paypal_subscription_id}/cancel`,
        { reason: 'watever' },
      );

      if (cancelResponse.status === 204) {
        subscription.status = 'CANCELED';
        subscription.cancelation_reason = cancelationReason;
        subscription.canceled_at = new Date().toISOString();

        await subscriptionRepository.update(subscription.id, subscription);
      }
    }

    return subscription;
  }
}

export default CancelSubscriptionService;
