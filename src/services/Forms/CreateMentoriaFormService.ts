import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';
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

    const alreadyFilled = await mentoriaFormRepository.findOne({
      where: { email },
    });

    if (alreadyFilled) {
      throw new AppError('Você já preencheu esse formulário ');
    }

    const cleanPhoneNumber = phone_number
      .replace('-', '')
      .replace('(', '')
      .replace(')', '');

    const mentoriaForm = mentoriaFormRepository.create({
      name,
      email,
      phone_number: cleanPhoneNumber,
      telegram_username,
      trading_time,
    });

    try {
      const results = await mentoriaFormRepository.save(mentoriaForm);
      return results;
    } catch (error) {
      console.error(error);
      throw new AppError('Não foi possivel enviar o fomrmulário');
    }
  }
}

export default CreateMentoriaFormService;
