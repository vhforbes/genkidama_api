// import crypto from 'crypto';
import { hash } from 'bcryptjs';
import crypto from 'crypto';
import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';

import SendVerificationEmailService from './SendVerificationEmailService';

import ConfirmEmailToken from '../../models/ConfirmEmailToken';
import User from '../../models/User';
import BitgetUID from '../../models/BitgetAssociatedUids';
import { roles } from '../../enums/roles';

interface Request {
  name: string;
  email: string;
  password: string;
  bitgetUID?: string;
}

interface Response {
  user: User;
}

// EMAIL SERVICE TO-BE IMPLEMENTED WHEN EMAIL ONLINE

class CreateUserService {
  public static async execute({
    name,
    email,
    password,
    bitgetUID,
  }: Request): Promise<Response> {
    const userRepository = AppDataSource.getRepository(User);
    const bitgetRepository = AppDataSource.getRepository(BitgetUID);

    const lowerCaseEmail = email.toLowerCase();

    const confirmEmailTokenRepository =
      AppDataSource.getRepository(ConfirmEmailToken);

    const userExists = await userRepository.findOne({
      where: { email: lowerCaseEmail },
    });

    if (userExists) {
      throw new AppError('Email already in use');
    }

    const hashedPassword = await hash(password, 8);

    let hasBitgetAccount = null;

    if (bitgetUID) {
      hasBitgetAccount = await bitgetRepository.findOne({
        where: { BitgetUID: bitgetUID },
      });
    }

    const user = userRepository.create({
      name,
      email: lowerCaseEmail,
      password: hashedPassword,
      bitgetUID,
      role: hasBitgetAccount ? roles.bitget : '',
      // eslint-disable-next-line no-unneeded-ternary
      exchangePartner: hasBitgetAccount ? true : false,
    });

    // Send verification email

    const createdUser = await userRepository.save(user);

    const emailVerificationToken = confirmEmailTokenRepository.create({
      user_id: createdUser.id,
      token: crypto.randomBytes(16).toString('hex'),
    });

    await SendVerificationEmailService.execute({
      email,
      token: emailVerificationToken.token,
    });

    await confirmEmailTokenRepository.save(emailVerificationToken);

    return { user: createdUser };
  }
}

export default CreateUserService;
