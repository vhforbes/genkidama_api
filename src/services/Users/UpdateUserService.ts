import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';
import User from '../../models/User';

interface Request {
  id: string;
  name: string;
  bitgetUID: string;
}

// EMAIL SERVICE TO-BE IMPLEMENTED WHEN EMAIL ONLINE

class UpdateUserService {
  public static async execute({ id, name, bitgetUID }: Request): Promise<User> {
    const userRepository = AppDataSource.getRepository(User);

    const userToUpdate = await userRepository.findOne({
      where: {
        id,
      },
    });

    if (!userToUpdate) {
      throw new AppError('User not found', 400);
    }

    userToUpdate.bitgetUID = bitgetUID;
    userToUpdate.name = name;

    await userRepository.save(userToUpdate);

    return userToUpdate;
  }
}

export default UpdateUserService;
