import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';

import Subscription from '../../models/Subscription';

import paypalPrivateApi from '../../apis/paypalPrivateApi';
import User from '../../models/User';
import { subscriptionTypes } from '../../enums/subscriptionTypes';
import sendMessageToUser from '../../bot/utils/sendMessageToUser';

interface Request {
  userId?: string;
  cancelationReason?: string;
}

class CancelSubscriptionService {
  public static async execute({
    userId,
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

    const subscription = user?.subscription;

    if (!subscription) {
      throw new AppError('Subscription was not found');
    }

    if (subscription.status !== 'ACTIVE') {
      throw new AppError('Not a active subscription');
    }

    // ----- CANCEL A PAYPAL SUBSCRIPTION -----
    if (
      subscription.type === subscriptionTypes.paypal &&
      subscription.status === 'ACTIVE'
    ) {
      const cancelarionResponse = await paypalPrivateApi.post(
        `/billing/subscriptions/${subscription.paypal_subscription_id}/cancel`,
        { reason: cancelationReason },
      );

      if (cancelarionResponse.status === 204) {
        // subscription.status = 'CANCELED';
        subscription.cancelation_reason = cancelationReason;
        subscription.canceled_at = new Date().toISOString();

        await subscriptionRepository.update(subscription.id, subscription);
      }
    }

    // ----- CANCEL A MANUAL SUBSCRIPTION -----
    if (
      subscription.status === 'ACTIVE' &&
      subscription.type !== subscriptionTypes.paypal
    ) {
      subscription.status = 'CANCELED';
      subscription.cancelation_reason = cancelationReason;
      subscription.canceled_at = new Date().toISOString();

      await subscriptionRepository.update(subscription.id, subscription);
    }

    sendMessageToUser({
      user,
      messageHtml:
        'Atenção Kakaroto, sua assinatura foi cancelada. Fico triste em vê-lo partir, espero que iremos nos ver novamente!',
    });

    return subscription;
  }
}

export default CancelSubscriptionService;
