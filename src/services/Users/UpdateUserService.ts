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
    exchangeUID,
    role,
    exchangePartner,
    exchange,
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
    user.exchange = exchange;
    user.exchangePartner = exchangePartner;

    // ---- BITGET UID UPDATE LOGIC ----
    if (exchangeUID !== user.exchangeUID) {
      const bitgetIdAlreadyInUse = await userRepository.findOne({
        where: {
          exchangeUID,
        },
      });

      if (bitgetIdAlreadyInUse) {
        throw new AppError('Exchange UID already in use', 400);
      }

      user.exchangeUID = exchangeUID;

      // REFACTOR FOR IS EXCHANGE PARTNER
      const isBitgetPartner = await bitgetUIDRepository.findOne({
        where: {
          BitgetUID: exchangeUID,
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
