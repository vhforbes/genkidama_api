/* eslint-disable prettier/prettier */
import { AppDataSource } from '../../data-source';
import { subscriptionTypes } from '../../enums/subscriptionTypes';
import AppError from '../../errors/AppError';

import Subscription from '../../models/Subscription';
import User from '../../models/User';

interface Request {
  email: string;
  type: string;
  current_period_end?: string;
}

class CreateManualSubscriptionService {
  public static async execute({
    email,
    type,
    current_period_end,
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
    if (user?.subscription?.status === 'ACTIVE') {
      throw new AppError(
        'User already has a active subscription, edit it instead',
      );
    }

    const isValidSubscriptionType = (): boolean => {
      return Object.values(subscriptionTypes).includes(type);
    };

    if (!isValidSubscriptionType()) {
      throw new AppError('Subscription type is not valid');
    }

    if (
      (type !== subscriptionTypes.vip ||
        type !== subscriptionTypes.betaTester) &&
      !current_period_end
    ) {
      throw new AppError('You must provide a End Date for this subscription');
    }

    const dateNow = new Date().toISOString().split('.')[0] + 'Z';

    const adjustedEnddate = type === 'VIP' ? '' : current_period_end;

    const subscription = subscriptionRepository.create({
      user_id: user.id,
      email: user.email,
      status: 'ACTIVE',
      type,
      current_period_start: dateNow,
      current_period_end: adjustedEnddate,
    });

    const createdSubscription = await subscriptionRepository.save(subscription);

    user.subscription = createdSubscription;

    await userRepository.save(user);

    return subscription;
  }
}

export default CreateManualSubscriptionService;
