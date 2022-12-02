import crypto from 'crypto';
import { hash } from 'bcryptjs';
import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';

import SendVerificationEmailService from './SendVerificationEmailService';

import ConfirmEmailToken from '../../models/ConfirmEmailToken';
import User from '../../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

interface Response {
  user: User;
}

class CreateUserService {
  public static async execute({
    name,
    email,
    password,
  }: Request): Promise<Response> {
    const userRepository = AppDataSource.getRepository(User);
    const confirmEmailTokenRepository =
      AppDataSource.getRepository(ConfirmEmailToken);

    const userExists = await userRepository.findOne({
      where: { email },
    });

    if (userExists) {
      throw new AppError('Email already in use');
    }

    const hashedPassword = await hash(password, 8);

    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const createdUser = await userRepository.save(user);

    // Send verification email
    const emailVerificationToken = confirmEmailTokenRepository.create({
      user_id: createdUser.id,
      token: crypto.randomBytes(16).toString('hex'),
    });

    await SendVerificationEmailService.execute({
      token: emailVerificationToken.token,
    });

    await confirmEmailTokenRepository.save(emailVerificationToken);

    return { user: createdUser };
  }
}

export default CreateUserService;
