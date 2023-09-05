import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';
import BitgetUID from '../../models/BitgetAssociatedUids';
import User from '../../models/User';

// EMAIL SERVICE TO-BE IMPLEMENTED WHEN EMAIL ONLINE (?)
class UpdateUserService {
  public static async execute({
    id,
    name,
    email,
    bitgetUID,
    role,
    exchangePartner,
  }: User): Promise<User> {
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

    // ---- FIELDS TO UPDATE ----
    user.name = name;
    user.email = email;
    user.role = role;
    user.exchangePartner = exchangePartner;

    // ---- BITGET UID UPDATE LOGIC ----
    if (bitgetUID !== user.bitgetUID) {
      const bitgetIdAlreadyInUse = await userRepository.findOne({
        where: {
          bitgetUID,
        },
      });

      if (bitgetIdAlreadyInUse) {
        throw new AppError('Bitget UID already in use', 400);
      }

      user.bitgetUID = bitgetUID;

      const isBitgetPartner = await bitgetUIDRepository.findOne({
        where: {
          BitgetUID: bitgetUID,
        },
      });

      if (isBitgetPartner) {
        user.exchangePartner = true;
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
