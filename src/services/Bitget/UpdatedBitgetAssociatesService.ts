import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';
import BitgetUID from '../../models/BitgetAssociatedUids';
import User from '../../models/User';

interface Request {
  uidList: string[];
}

class UpdateBitgetAssociateService {
  public static async execute({ uidList }: Request): Promise<void> {
    const bitgetUIDRepository = AppDataSource.getRepository(BitgetUID);
    const userRepository = AppDataSource.getRepository(User);

    const users = await userRepository.find();

    const updatesUids = async () => {
      uidList.forEach(async uid => {
        const alreadyAdded = await bitgetUIDRepository.findOne({
          where: { BitgetUID: uid },
        });

        if (!alreadyAdded) {
          const newAssociateEntry = bitgetUIDRepository.create({
            BitgetUID: uid,
          });

          await bitgetUIDRepository.save(newAssociateEntry);
        }
      });
    };

    const checkIfUserHasUidInDb = async () => {
      users.forEach(async user => {
        if (!user.bitgetPartner && user.bitgetUID) {
          const existsOnDB = await bitgetUIDRepository.findOne({
            where: {
              BitgetUID: user.bitgetUID,
            },
          });

          if (existsOnDB) {
            const userToUpdate = await userRepository.findOne({
              where: { id: user.id },
            });

            if (!userToUpdate) {
              throw new AppError('User not found', 400);
            }

            if (!userToUpdate.role) {
              userToUpdate.role = 'BITGET';
            }

            userToUpdate.bitgetPartner = true;

            await userRepository.save(userToUpdate);
          }
        }
      });
    };

    await updatesUids();

    await checkIfUserHasUidInDb();
  }
}

export default UpdateBitgetAssociateService;
