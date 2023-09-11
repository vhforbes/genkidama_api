import { AppDataSource } from '../../data-source';
import { roles } from '../../enums/roles';
import User from '../../models/User';

// EMAIL SERVICE TO-BE IMPLEMENTED WHEN EMAIL ONLINE

class BanFromTelegramGroupService {
  public static async execute(): Promise<number[]> {
    const userRepository = AppDataSource.getRepository(User);

    const users = await userRepository.find({
      relations: { subscription: true },
    });

    const chatIdsToBan: number[] = [];

    for (let i = 0; i < users.length; i += 1) {
      const user = users[i];

      if (
        user.role !== roles.admin &&
        user.role !== roles.member &&
        user.subscription?.status !== 'ACTIVE'
      ) {
        console.log('BANIDO', user.email, user.telegramId);
        chatIdsToBan.push(user.telegramId);
        user.onTelegramGroup = false;

        // eslint-disable-next-line no-await-in-loop
        await userRepository.save(user);
      }
    }

    return chatIdsToBan;
  }
}

export default BanFromTelegramGroupService;
