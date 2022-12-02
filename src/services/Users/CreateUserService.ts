import crypto from 'crypto';
import { hash } from 'bcryptjs';
import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';
import ConfirmEmailToken from '../../models/ConfirmEmailToken';
import User from '../../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class CreateUserService {
  public static async execute({
    name,
    email,
    password,
  }: Request): Promise<Response> {
    const userRepository = AppDataSource.getRepository(User);
    const tokenRepository = AppDataSource.getRepository(ConfirmEmailToken);

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

    // Create a token to to be used in email verification
    const verificationToken = tokenRepository.create({
      user_id: createdUser.id,
      token: crypto.randomBytes(16).toString('hex'),
    });

    const createdToken = await tokenRepository.save(verificationToken);

    return { user: createdUser, token: createdToken.token };
  }
}

export default CreateUserService;
