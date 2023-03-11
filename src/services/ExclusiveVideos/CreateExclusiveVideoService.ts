import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';
import { ExclusiveVideoInterface } from '../../interfaces/ExclusiveVideoInterface';
import ExclusiveVideo from '../../models/ExclusiveVideo';
import User from '../../models/User';
import ExclusiveVideosRepository from '../../repositories/ExclusiveVideosRepository';

class CreateExclusiveVideoService {
  public static async execute(
    exclusiveVideo: ExclusiveVideoInterface,
  ): Promise<ExclusiveVideo | null> {
    const exclusiveVideosRepository = ExclusiveVideosRepository;
    const usersRepository = AppDataSource.getRepository(User);

    const { authorId, content, image, title, videoLink } = exclusiveVideo;

    const user = await usersRepository.findOne({
      where: { id: authorId },
    });

    if (!user) {
      throw new AppError('Unable to create post: User not found');
    }

    const newExclusiveVideo = exclusiveVideosRepository.create({
      author_id: authorId,
      title,
      content,
      image,
      video_link: videoLink,
    });

    const results = await exclusiveVideosRepository.save(newExclusiveVideo);

    return results;
  }
}

export default CreateExclusiveVideoService;
