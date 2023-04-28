import { AppDataSource } from '../../data-source';
import { roles } from '../../enums/roles';
import Subscription from '../../models/Subscription';
import User from '../../models/User';

interface Request {
  chatMembersNumber: number;
}

// EMAIL SERVICE TO-BE IMPLEMENTED WHEN EMAIL ONLINE

class BanFromTelegramGroupService {
  public static async execute({
    chatMembersNumber,
  }: Request): Promise<number[]> {
    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const userRepository = AppDataSource.getRepository(User);

    const subscribersNumber = await subscriptionRepository.count({
      where: { status: 'ACTIVE' },
    });

    const roleAssignedNumber = await userRepository.count({
      where: { role: roles.admin || roles.member || roles.subscriber },
    });

    const totalValidTelegramMembers = subscribersNumber + roleAssignedNumber;

    // + 1 is the BOT
    if (chatMembersNumber === totalValidTelegramMembers + 1) {
      return [];
    }

    const users = await userRepository.find();

    const chatIdsToBan: number[] = [];

    for (let i = 0; i < users.length; i += 1) {
      const user = users[i];

      // THIS SHIT IS BROKEN
      if (
        user.role !== roles.admin &&
        user.role !== roles.member &&
        user.role !== roles.subscriber
      ) {
        chatIdsToBan.push(user.telegramId);
      }
    }

    return chatIdsToBan;
  }
}

export default BanFromTelegramGroupService;
