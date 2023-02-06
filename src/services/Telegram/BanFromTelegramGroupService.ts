import { AppDataSource } from '../../data-source';
import Subscription from '../../models/Subscription';
import TelegramMember from '../../models/TelegramMember';

interface Request {
  chatMembersNumber: number;
}

// EMAIL SERVICE TO-BE IMPLEMENTED WHEN EMAIL ONLINE

class BanFromTelegramGroupService {
  public static async execute({
    chatMembersNumber,
  }: Request): Promise<number[] | null> {
    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const telegramMemberRepository =
      AppDataSource.getRepository(TelegramMember);

    const subscribersNumber = await subscriptionRepository.count({
      where: { status: 'ACTIVE' },
    });

    if (chatMembersNumber === subscribersNumber + 1) {
      return null;
    }

    const members = await telegramMemberRepository.find({
      relations: { subscription: true },
    });

    const chatIdsToBan: number[] = [];

    for (let i = 0; i < members.length; i += 1) {
      const member = members[i];

      if (member.subscription.status !== 'ACTIVE') {
        chatIdsToBan.push(member.telegram_id);
      }
    }

    return chatIdsToBan;
  }
}

export default BanFromTelegramGroupService;
