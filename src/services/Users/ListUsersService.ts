import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';

import User from '../../models/User';

class ListUsersService {
  public static async execute(): Promise<{}> {
    const usersRepository = AppDataSource.getRepository(User);

    const users = await usersRepository.find({
      relations: ['subscription'],
      order: {
        name: 'ASC',
      },
    });

    if (!users) {
      throw new AppError('Could not retrieve list of users');
    }

    return {
      users,
    };
  }
}

export default ListUsersService;
