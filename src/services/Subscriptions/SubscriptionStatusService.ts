import paypalPrivateApi from '../../apis/paypalPrivateApi';
import sendMessageToUser from '../../bot/utils/sendMessageToUser';
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
    const subscriptionRepository = AppDataSource.getRepository(Subscription);

    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['subscription'],
    });

    if (!user) throw new AppError('User was not found');

    if (user.role === 'ADMIN') return { status: 'ADMIN USER' };

    const subscription = user.subscription;

    // TEMPORARY LOGIC TO FILL EMAILS ON SUBSCRIPTION (DELETE ONE DAY)
    if (!subscription.email) {
      subscription.email = user?.email;
    }

    if (!subscription) {
      return {
        status: 'NO SUBSCRIPTION FOUND',
      };
    }

    // ---- Exits logic if its a lifetime subscription ----

    if (!subscription.current_period_end) return { status: 'NO END DATE' };

    // ---- Checks if the subscription has expired ----

    const expirationDate = Date.parse(subscription.current_period_end);
    const todayDate = Date.now();

    // -- Vai fazer a checagem de cancelamento em breve e manda um aviso. --

    const willExpireSoon = todayDate > expirationDate;

    if (willExpireSoon) {
      const willExpireMessage = `Atenção Kakaroto, sua assinatura está prestes a expirar. Confira se suas informações de pagamento ou entre em contato com o @vhforbes para evitar o cancelameno da sua assinatura.`;
      sendMessageToUser({ user, messageHtml: willExpireMessage });
    }

    const bufferDays = 15;
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const bufferedExpirationDate =
      expirationDate + bufferDays * millisecondsPerDay;

    const isExpired = todayDate > bufferedExpirationDate;

    const sendCancelationMessage = () => {
      const expiredMessage = `Atenção Kakaroto, sua assinatura foi cancelada... Caso você ache que isso é um erro, entre em contato com o @vhforbes.`;

      sendMessageToUser({ user, messageHtml: expiredMessage });
    };

    if (
      subscription.type !== subscriptionTypes.paypal &&
      subscription.status === 'ACTIVE' &&
      isExpired
    ) {
      subscription.status = 'CANCELED';
      subscription.canceled_at = new Date().toISOString();
      subscription.cancelation_reason = 'Cancelada pelo sistema';

      subscriptionRepository.save(subscription);

      sendCancelationMessage();
    }

    if (
      subscription.type === subscriptionTypes.paypal &&
      subscription.status === 'ACTIVE' &&
      isExpired
    ) {
      const { data } = await paypalPrivateApi(
        `/billing/subscriptions/${subscription.paypal_subscription_id}`,
      );

      if (!data) {
        throw new AppError('Unable to retrive subscriptions details');
      }

      // Atualiza a data de cobrança
      if (data.status === 'ACTIVE') {
        subscription.current_period_end = data.billing_info.next_billing_time;
        subscriptionRepository.save(subscription);
      }

      // Cancela a subscription
      if (data.status === 'CANCELLED' || data.status === 'SUSPENDED') {
        subscription.status = data.status;
        subscription.canceled_at = new Date().toISOString();
        subscription.cancelation_reason = 'Cancelada pelo sistema';

        subscriptionRepository.save(subscription);

        sendCancelationMessage();
      }
    }

    return subscription;
  }
}

export default SubscriptionStatusService;
