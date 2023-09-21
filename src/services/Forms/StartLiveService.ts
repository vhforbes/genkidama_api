import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';
import LiveStatus from '../../models/LiveStatus';

interface Request {
  live: boolean;
}

class StartLiveService {
  public static async execute({ live }: Request): Promise<void> {
    const liveStatusRepository = AppDataSource.getRepository(LiveStatus);

    let liveStatus = await liveStatusRepository.find();

    try {
      if (liveStatus.length > 0) {
        await liveStatusRepository.delete(liveStatus[0]);
        liveStatus = await liveStatusRepository.find(); // Refetch after deleting
      }

      if (!liveStatus.length) {
        const createdLive = liveStatusRepository.create({ live: live });
        await liveStatusRepository.save(createdLive);
      }
    } catch (error) {
      console.error(error);
      throw new AppError('Não foi possivel abrir a Live');
    }
  }
}

export default StartLiveService;
