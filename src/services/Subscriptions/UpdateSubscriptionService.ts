import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';

import Subscription from '../../models/Subscription';

class UpdateSubscriptionService {
  public static async execute({
    id,
    status,
    paypal_subscription_id,
    type,
    cancelation_reason,
    current_period_end,
  }: Subscription): Promise<Subscription> {
    const subscriptionRepository = AppDataSource.getRepository(Subscription);

    const subscriptionToUpdate = await subscriptionRepository.findOne({
      where: { id },
    });

    if (!subscriptionToUpdate) {
      throw new AppError('Subscription was not found');
    }

    // ---- SUBSCRPTION CANCELADA MANUALMENTE ----
    if (subscriptionToUpdate.status === 'ACTIVE' && status === 'CANCELED') {
      subscriptionToUpdate.current_period_end = new Date().toISOString();
    }

    const adjustedEnddate = type === 'VIP' ? '' : current_period_end;

    subscriptionToUpdate.status = status;
    subscriptionToUpdate.paypal_subscription_id = paypal_subscription_id;
    subscriptionToUpdate.type = type;
    subscriptionToUpdate.cancelation_reason = cancelation_reason;
    subscriptionToUpdate.current_period_end = adjustedEnddate;

    subscriptionRepository.save(subscriptionToUpdate);

    return subscriptionToUpdate;
  }
}

export default UpdateSubscriptionService;
