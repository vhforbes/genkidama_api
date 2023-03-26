// import crypto from 'crypto';
import { AppDataSource } from '../../data-source';
import { roles } from '../../enums/roles';
import AppError from '../../errors/AppError';
import TelegramMember from '../../models/TelegramMember';

// import SendVerificationEmailService from './SendVerificationEmailService';

// import ConfirmEmailToken from '../../models/ConfirmEmailToken';
import User from '../../models/User';

interface Request {
  email: string;
  telegramUserId: number;
  fullName: string;
}

interface Response {
  telegramMember?: TelegramMember;
  success: boolean;
  messageForBot: string;
}

// EMAIL SERVICE TO-BE IMPLEMENTED WHEN EMAIL ONLINE

class AddTelegramGroupService {
  public static async execute({
    email,
    telegramUserId,
    fullName,
  }: Request): Promise<Response> {
    const userRepository = AppDataSource.getRepository(User);
    const telegramMemberRepository =
      AppDataSource.getRepository(TelegramMember);

    const user = await userRepository.findOne({
      where: { email },
      relations: { subscription: true },
    });

    if (!user) {
      throw new AppError('Could not find user');
    }

    const alreadyOnGroup = await telegramMemberRepository.findOne({
      where: { email },
    });

    if (alreadyOnGroup) {
      return {
        success: false,
        messageForBot: 'Parece que você já está no grupo!',
      };
    }

    // TOO MANY QYERIES HOW CAN I GET THE SUBSCRIPTION DIRECTLY
    const subscription = user.subscription;
    const role = user.role;

    if (!subscription || !role) {
      throw new AppError('Could not find subscription');
    }

    if (subscription.status !== 'ACTIVE' || role !== roles.member) {
      return {
        success: false,
        messageForBot:
          'Sua assinatura expirou. Assine novamente no nosso site!',
      };
    }

    const newMemberOnGroup = telegramMemberRepository.create({
      user_id: user.id,
      email: email,
      telegram_id: telegramUserId,
      name: fullName,
      subscription_id: subscription?.id,
      role: role,
    });

    const createdNewMemberOnGroup = await telegramMemberRepository.save(
      newMemberOnGroup,
    );

    return {
      success: true,
      telegramMember: createdNewMemberOnGroup,
      messageForBot: 'Sucesso',
    };
  }
}

export default AddTelegramGroupService;
