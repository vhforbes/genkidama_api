import { AppDataSource } from '../../data-source';
import BitgetUID from '../../models/BitgetAssociatedUids';

interface Request {
  uidList: string[];
}

class UpdateBitgetAssociateService {
  public static async execute({ uidList }: Request): Promise<void> {
    const bitgetUIDRepository = AppDataSource.getRepository(BitgetUID);

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
  }
}

export default UpdateBitgetAssociateService;
