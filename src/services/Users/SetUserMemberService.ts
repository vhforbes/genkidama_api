import { AppDataSource } from '../../data-source';

import User from '../../models/User';
import AppError from '../../errors/AppError';
import { roles } from '../../enums/roles';

interface Request {
  email: string;
  isMember: boolean;
}

class SetUserMemberService {
  public static async execute({ email, isMember }: Request): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new AppError('Invalid user email');
    }

    if (user.role === roles.member && isMember) {
      throw new AppError('User already a member');
    }

    if (user.role !== roles.member && !isMember) {
      throw new AppError('User is not a member');
    }

    if (isMember) {
      user.role = roles.member;
    }

    if (!isMember) {
      user.role = '';
    }

    userRepository.save(user);

    return user;
  }
}

export default SetUserMemberService;
