import { AppDataSource } from '../../data-source';
import { roles } from '../../enums/roles';
import AppError from '../../errors/AppError';
import BitgetUID from '../../models/BitgetAssociatedUids';
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
    const bitgetUIDRepository = AppDataSource.getRepository(BitgetUID);

    const userToUpdate = await userRepository.findOne({
      where: {
        id,
      },
    });

    if (!userToUpdate) {
      throw new AppError('User not found', 400);
    }

    if (bitgetUID) {
      const existsOnDB = await bitgetUIDRepository.findOne({
        where: {
          BitgetUID: bitgetUID,
        },
      });

      if (existsOnDB) {
        userToUpdate.role = roles.bitget;
      }
    }

    userToUpdate.bitgetUID = bitgetUID;
    userToUpdate.name = name;

    await userRepository.save(userToUpdate);

    return userToUpdate;
  }
}

export default UpdateUserService;
