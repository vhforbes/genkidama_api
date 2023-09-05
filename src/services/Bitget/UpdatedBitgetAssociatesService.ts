import { IsNull, Not } from 'typeorm';
import { AppDataSource } from '../../data-source';
import BitgetUID from '../../models/BitgetAssociatedUids';
import User from '../../models/User';
import { roles } from '../../enums/roles';

interface Request {
  uidList: string[];
}

class UpdateBitgetAssociateService {
  public static async execute({ uidList }: Request): Promise<void> {
    const bitgetUIDRepository = AppDataSource.getRepository(BitgetUID);
    const userRepository = AppDataSource.getRepository(User);

    const usersWithUID = await userRepository.find({
      where: {
        bitgetUID: Not(IsNull()),
        exchangePartner: false,
      },
    });

    const updatesUidsOnDb = async () => {
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

    const updateUsersPartnerStatus = async () => {
      usersWithUID.forEach(async user => {
        if (uidList.includes(user.bitgetUID)) {
          const updatedUser = user;

          updatedUser.exchangePartner = true;
          updatedUser.role = roles.bitget;

          await userRepository.save(updatedUser);
        }
      });
    };

    await updatesUidsOnDb();
    await updateUsersPartnerStatus();
  }
}

export default UpdateBitgetAssociateService;
