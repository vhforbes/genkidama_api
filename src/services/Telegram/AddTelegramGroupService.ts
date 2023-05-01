import { AppDataSource } from '../../data-source';
import { roles } from '../../enums/roles';
import User from '../../models/User';

interface Request {
  email: string;
  telegramUserId: number;
}

interface Response {
  success: boolean;
  messageForBot: string;
}

class AddTelegramGroupService {
  public static async execute({
    email,
    telegramUserId,
  }: Request): Promise<Response> {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { email },
      relations: { subscription: true },
    });

    if (!user) {
      return {
        success: false,
        messageForBot: 'Não conseguimos encontrar um usuario com esse email..',
      };
    }

    if (user.onTelegramGroup) {
      return {
        success: false,
        messageForBot: 'Parece que você já está no grupo!',
      };
    }

    if (
      user.subscription?.status !== 'ACTIVE' &&
      user.role !== roles.member &&
      user.role !== roles.admin
    ) {
      return {
        success: false,
        messageForBot:
          'Sua assinatura não está ativa. Assine novamente na genkidama.me!',
      };
    }

    user.onTelegramGroup = true;
    user.telegramId = telegramUserId;

    await userRepository.save(user);

    return {
      success: true,
      messageForBot: 'Sucesso',
    };
  }
}

export default AddTelegramGroupService;
