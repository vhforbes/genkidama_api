import { AppDataSource } from '../data-source';
import { roles } from '../enums/roles';
import User from '../models/User';

const UsersRepository = AppDataSource.getRepository(User).extend({
  async memberList(): Promise<User[]> {
    const users = await this.find({
      relations: {
        subscription: true,
      },
    });

    const membersAndSubscribers = [] as User[];

    users.forEach(async (user: User) => {
      if (
        user.telegramId &&
        (user.subscription?.status === 'ACTIVE' ||
          user.role === roles.member ||
          user.role === roles.admin)
      ) {
        membersAndSubscribers.push(user);
      }
    });

    return membersAndSubscribers;
  },
});

export default UsersRepository;
