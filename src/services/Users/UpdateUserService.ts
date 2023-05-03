import { AppDataSource } from '../../data-source';
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

    const user = await userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new AppError('User not found', 400);
    }

    user.name = name;

    if (bitgetUID) {
      user.bitgetUID = bitgetUID;

      const isBitgetPartner = await bitgetUIDRepository.findOne({
        where: {
          BitgetUID: bitgetUID,
        },
      });

      if (isBitgetPartner) {
        user.bitgetPartner = true;
      }

      if (isBitgetPartner && !user.role) {
        user.role = 'BITGET';
      }
    }

    await userRepository.save(user);

    return user;
  }
}

export default UpdateUserService;
