import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { AppDataSource } from '../../data-source';

import AuthConfig from '../../config/auth';
import User from '../../models/User';
import AppError from '../../errors/AppError';
import Subscription from '../../models/Subscription';
/**
 * [x] Recebe as infos da chamada
 * [x] Tratativa de erros/excessoes, logicas de negcio, ifs
 * [x] Acesso ao repositorio
 */

interface Request {
  email: string;
  password: string;
}

interface Return {
  user: User;
  token: string;
  refreshToken: string;
  subscription: Subscription | null;
}

class CreateSessionService {
  public static async execute({ email, password }: Request): Promise<Return> {
    const userRepository = AppDataSource.getRepository(User);
    const subscriptionRepository = AppDataSource.getRepository(Subscription);

    const userPassword = await userRepository.findOne({
      where: { email },
      select: ['password'],
    });

    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user || !userPassword) {
      throw new AppError('Invalid user or password', 401);
    }

    const validPassword = await compare(password, userPassword.password);

    if (!validPassword) {
      throw new AppError('Invalid user or password', 401);
    }

    const RefreshTokenConfig = AuthConfig.refreshToken;
    let refreshToken = sign(
      { id: user.id, name: user.name },
      RefreshTokenConfig.secret,
      {
        expiresIn: RefreshTokenConfig.expiresIn,
      },
    );

    const AuthTokenConfig = AuthConfig.jwt;
    let token = sign({ id: user.id, name: user.name }, AuthTokenConfig.secret, {
      expiresIn: AuthTokenConfig.expiresIn,
    });

    const subscription = await subscriptionRepository.findOne({
      where: { id: user.subscription_id },
    });

    return { user, token, refreshToken, subscription };
  }
}

export default CreateSessionService;
