import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';

import Subscription from '../../models/Subscription';
import User from '../../models/User';

interface Request {
  userId: string;
}

class SubscriptionStatusService {
  public static async execute({
    userId,
  }: Request): Promise<{ status: string | null }> {
    const userRepository = AppDataSource.getRepository(User);
    const subscriptionRepository = AppDataSource.getRepository(Subscription);

    const user = await userRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new AppError('User was not found');

    const subscription = await subscriptionRepository.findOne({
      where: { id: user?.subscription_id },
    });

    if (!subscription) {
      return {
        status: 'NO SUBSCRIPTION FOUND',
      };
    }

    return subscription;
  }
}

export default SubscriptionStatusService;
