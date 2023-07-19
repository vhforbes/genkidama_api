import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';

import Subscription from '../../models/Subscription';

import paypalPrivateApi from '../../apis/paypalPrivateApi';
import User from '../../models/User';

interface Request {
  userId?: string;
  paypalSubscriptionId: string;
  cancelationReason?: string;
}

class CancelSubscriptionService {
  public static async execute({
    userId,
    paypalSubscriptionId,
    cancelationReason,
  }: Request): Promise<{}> {
    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const userRepository = AppDataSource.getRepository(User);

    if (!userId) {
      throw new AppError('No User ID');
    }

    const user = await userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['subscription'],
    });

    console.log('USER CANCELING: ', user);

    // const subscription = await subscriptionRepository.findOne({
    //   where: { paypal_subscription_id: paypalSubscriptionId },
    // });

    const subscription = user?.subscription;

    console.log('SUBSCRIPTION: ', subscription);

    if (!subscription) {
      throw new AppError('Subscription was not found');
    }

    if (subscription.status !== 'ACTIVE') {
      throw new AppError('Not a active subscription');
    }

    if (subscription.status === 'ACTIVE') {
      const cancelResponse = await paypalPrivateApi.post(
        `/billing/subscriptions/${subscription.paypal_subscription_id}/cancel`,
        { reason: cancelationReason },
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
