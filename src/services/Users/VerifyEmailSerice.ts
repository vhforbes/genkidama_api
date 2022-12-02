import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';
import Token from '../../models/ConfirmEmailToken';
import User from '../../models/User';

interface Request {
  token: string;
}

interface Response {
  success: boolean;
}

class VerifyEmailSerice {
  public static async execute({ token }: Request): Promise<Response> {
    const tokenRepository = AppDataSource.getRepository(Token);
    const userRepository = AppDataSource.getRepository(User);

    const verificationToken = await tokenRepository.findOne({
      where: { token },
    });

    if (!verificationToken) {
      throw new AppError('Invalid confirmation token');
    }

    const verifiedUser = await userRepository.findOne({
      where: { id: verificationToken.user_id },
    });

    if (!verifiedUser) {
      throw new AppError('Unable to find user to verify email address');
    }

    verifiedUser.verified = true;

    await userRepository.save(verifiedUser);
    await tokenRepository.delete(verificationToken);

    return { success: true };
  }
}

export default VerifyEmailSerice;
