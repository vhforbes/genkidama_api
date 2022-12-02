import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';
import Subscription from '../../models/Subscription';
import User from '../../models/User';
import paypalApi from '../../utils/paypalApi';

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

    if (user.subscription_id) {
      throw new AppError('User already has a subscription, update it instead');
    }

    const { data } = await paypalApi(
      `/billing/subscriptions/${subscriptionID}`,
    );

    if (!data) {
      throw new AppError('Unable to retrive subscriptions details');
    }

    const subscription = subscriptionRepository.create({
      user_id: user.id,
      subscription_id: subscriptionID,
      plan_id: data.plan_id,
      status: 'ACTIVE',
      current_period_start: data.start_time,
      current_period_end: data.billing_info.next_billing_time,
    });

    const createdSubscription = await subscriptionRepository.save(subscription);

    user.subscription_id = createdSubscription.id;
    user.subscription = createdSubscription;

    const updateUser = await userRepository.save(user);

    return {
      user: updateUser,
    };
  }
}

export default CreateSubscriptionService;
