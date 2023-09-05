import { IsNull, Not } from 'typeorm';
import { AppDataSource } from '../../data-source';
import User from '../../models/User';
import { roles } from '../../enums/roles';
import BybitUID from '../../models/BybitAssociatedUids';

interface Request {
  uidList: string[];
}

class UpdateBybitAssociateService {
  public static async execute({ uidList }: Request): Promise<void> {
    const bybitUIDRepository = AppDataSource.getRepository(BybitUID);
    const userRepository = AppDataSource.getRepository(User);

    const usersWithUID = await userRepository.find({
      where: {
        exchangeUID: Not(IsNull()),
        exchangePartner: false,
      },
    });

    const updatesUidsOnDb = async () => {
      uidList.forEach(async uid => {
        const alreadyAdded = await bybitUIDRepository.findOne({
          where: { BybitUID: uid },
        });

        if (!alreadyAdded) {
          const newAssociateEntry = bybitUIDRepository.create({
            BybitUID: uid,
          });

          await bybitUIDRepository.save(newAssociateEntry);
        }
      });
    };

    const updateUsersPartnerStatus = async () => {
      usersWithUID.forEach(async user => {
        if (uidList.includes(user.exchangeUID)) {
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

export default UpdateBybitAssociateService;
