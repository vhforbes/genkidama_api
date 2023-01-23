import { AppDataSource } from '../../data-source';
import MentoriaForm from '../../models/MentoriaForm';

interface Request {
  name: string;
  email: string;
  phone_number: string;
  telegram_username: string;
  trading_time: string;
}

class CreateMentoriaFormService {
  public static async execute({
    name,
    email,
    phone_number,
    telegram_username,
    trading_time,
  }: Request): Promise<MentoriaForm | null> {
    const mentoriaFormRepository = AppDataSource.getRepository(MentoriaForm);

    const mentoriaForm = mentoriaFormRepository.create({
      name,
      email,
      phone_number,
      telegram_username,
      trading_time,
    });

    const results = await mentoriaFormRepository.save(mentoriaForm);

    return results;
  }
}

export default CreateMentoriaFormService;
