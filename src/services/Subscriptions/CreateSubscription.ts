import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';
import Subscription from '../../models/Subscription';
import User from '../../models/User';

interface Request {
  email: string;
  subscription_id: string;
  plan_id: string;
}

/*
  [] Receive webhook
  [] Validate webhook validity
  [] Sort event type
  [] Create or Update Subscription
*/

class CreateSubscriptionService {
  public static async execute({
    email,
    subscription_id,
    plan_id,
  }: Request): Promise<{}> {
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

    const subscription = subscriptionRepository.create({
      user_id: user?.id,
      subscription_id,
      plan_id,
      status: 'ACTIVE',
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
