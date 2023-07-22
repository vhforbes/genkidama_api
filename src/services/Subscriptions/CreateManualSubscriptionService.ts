import { AppDataSource } from '../../data-source';
import { subscriptionTypes } from '../../enums/subscriptionTypes';
import AppError from '../../errors/AppError';

import Subscription from '../../models/Subscription';
import User from '../../models/User';

interface Request {
  email: string;
  type: string;
  endDate?: string;
  lifetime: boolean;
}

class CreateManualSubscriptionService {
  public static async execute({
    email,
    type,
    endDate,
    lifetime,
  }: Request): Promise<{}> {
    const userRepository = AppDataSource.getRepository(User);
    const subscriptionRepository = AppDataSource.getRepository(Subscription);

    const user = await userRepository.findOne({
      where: { email },
      relations: ['subscription'],
    });

    if (!user) {
      throw new AppError('User not found');
    }

    // CHECKS IF USER HAS A ACTIVE SUBSCRIPTION
    if (user.subscription) {
      const subscription = await subscriptionRepository.findOne({
        where: { id: user.subscription.id },
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

    const isValidSubscriptionType = (): boolean => {
      return Object.values(subscriptionTypes).includes(type);
    };

    if (!isValidSubscriptionType()) {
      throw new AppError('Subscription type is not valid');
    }

    if (!lifetime && !endDate) {
      throw new AppError('You must provide a End Date for this subscription');
    }

    const dateNow = new Date().toISOString().split('.')[0] + 'Z';

    const subscription = subscriptionRepository.create({
      user_id: user.id,
      paypal_subscription_id: 'subscriptionID',
      status: 'ACTIVE',
      type,
      current_period_start: dateNow,
      current_period_end: endDate,
    });

    const createdSubscription = await subscriptionRepository.save(subscription);

    user.subscription = createdSubscription;

    await userRepository.save(user);

    return subscription;
  }
}

export default CreateManualSubscriptionService;
