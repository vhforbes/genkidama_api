import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';

import Subscription from '../../models/Subscription';
import User from '../../models/User';

// import paypalPrivateApi from '../../apis/paypalPrivateApi';
import { subscriptionTypes } from '../../enums/subscriptionTypes';
import sendMessageToAdmins from '../../bot/utils/sendMessageToAdmins';

interface Request {
  email: string;
  paypal_subscription_id: string;
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
    paypal_subscription_id,
  }: Request): Promise<{}> {
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

      if (subscription?.status === 'ACTIVE') {
        throw new AppError(
          'User already has a active subscription, update it instead',
        );
      }
    }

    if (!paypal_subscription_id) {
      await sendMessageToAdmins({
        messageHtml: `Erro ao obter subscription ID para ${user.email}. Atualizar manualmente.`,
      });
    }

    // const { data } = await paypalPrivateApi(
    //   `/billing/subscriptions/${paypal_subscription_id}`,
    // );

    const subscription = subscriptionRepository.create({
      user_id: user.id,
      paypal_subscription_id,
      // plan_id: data?.plan_id,
      email: user.email,
      status: 'ACTIVE',
      type: subscriptionTypes.paypal,
      current_period_start: new Date().toISOString(),
      // current_period_end: data?.billing_info.next_billing_time,
    });

    const createdSubscription = await subscriptionRepository.save(subscription);

    user.subscription = createdSubscription;

    await userRepository.save(user);

    return subscription;
  }
}

export default CreateSubscriptionService;
