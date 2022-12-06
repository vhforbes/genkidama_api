import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';

import Subscription from '../../models/Subscription';
import User from '../../models/User';

import paypalApi from '../../apis/paypalApi';

interface Request {
  email: string;
  subscriptionID: string;
}

/*
  [] Receive webhook
  [] Validate webhook validity
  [] Sort event type
  [] Create or Update Subscription
*/

class CreateSubscriptionService {
  public static async execute({ email, subscriptionID }: Request): Promise<{}> {
    const userRepository = AppDataSource.getRepository(User);
    const subscriptionRepository = AppDataSource.getRepository(Subscription);

    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new AppError('User not found');
    }

    // CHECKS IF USER HAS A ACTIVE SUBSCRIPTION
    if (user.subscription_id) {
      const subscription = await subscriptionRepository.findOne({
        where: { id: user.subscription_id },
      });

      if (!subscription) {
        throw new AppError('User subscription was not found');
      }

      if (subscription.status === 'ACTIVE') {
        throw new AppError(
          'User already has a active subscription, update it instead',
        );
      }
    }

    const { data } = await paypalApi(
      `/billing/subscriptions/${subscriptionID}`,
    );

    if (!data) {
      throw new AppError('Unable to retrive subscriptions details');
    }

    const subscription = subscriptionRepository.create({
      user_id: user.id,
      paypal_subscription_id: subscriptionID,
      plan_id: data.plan_id,
      status: 'ACTIVE',
      current_period_start: data.start_time,
      current_period_end: data.billing_info.next_billing_time,
    });

    const createdSubscription = await subscriptionRepository.save(subscription);

    user.subscription = createdSubscription;

    await userRepository.save(user);

    return {
      subscription: subscription,
    };
  }
}

export default CreateSubscriptionService;
