import paypalPrivateApi from '../../apis/paypalPrivateApi';
import { AppDataSource } from '../../data-source';
import { subscriptionTypes } from '../../enums/subscriptionTypes';
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
    // const subscriptionRepository = AppDataSource.getRepository(Subscription);

    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['subscription'],
    });

    if (!user) throw new AppError('User was not found');

    const subscription = user.subscription;

    if (!subscription) {
      return {
        status: 'NO SUBSCRIPTION FOUND',
      };
    }

    // ---- Exits logic if its a lifetime subscription ----
    //
    if (!subscription.current_period_end) return { status: 'NO END DATE' };

    // ---- Checks if the subscription has expired ----
    //
    const expirationDate = Date.parse(subscription.current_period_end);

    // add a 15-day buffer to the expiration date
    const bufferDays = 15;
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const bufferedExpirationDate =
      expirationDate + bufferDays * millisecondsPerDay;

    const todayDate = Date.now();

    const isExpired = todayDate > bufferedExpirationDate;

    // Check status with paypal
    // Update accoring to the return
    // Cancel in case of expired date
    if (
      subscription.type === subscriptionTypes.paypal &&
      subscription.status === 'ACTIVE' &&
      isExpired
    ) {
      const { data } = await paypalPrivateApi(
        `/billing/subscriptions/${subscription.paypal_subscription_id}`,
      );

      console.log(data);

      if (!data) {
        throw new AppError('Unable to retrive subscriptions details');
      }

      if (data.status === 'CANCELLED' || data.status === 'SUSPENDED') {
        subscription.status = data.status;
        subscription.canceled_at = new Date().toISOString();
      }
    }

    return subscription;
  }
}

export default SubscriptionStatusService;
