// import crypto from 'crypto';
import { hash } from 'bcryptjs';

import { AppDataSource } from '../../data-source';
import AppError from '../../errors/AppError';
import User from '../../models/User';

import { verify } from 'jsonwebtoken';
import resetPassword from '../../config/resetPassword';

interface TokenPayload {
  email: string;
}

interface Request {
  token: string;
  newPassword: string;
}

interface Response {
  user: User;
}

// EMAIL SERVICE TO-BE IMPLEMENTED WHEN EMAIL ONLINE

class UpdatePasswordService {
  public static async execute({
    token,
    newPassword,
  }: Request): Promise<Response> {
    const userRepository = AppDataSource.getRepository(User);

    const decodedToken = verify(
      token,
      resetPassword.jwt.secret,
    ) as TokenPayload;

    const { email } = decodedToken;

    const user = await userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new AppError('User dont exist');
    }

    const hashedPassword = await hash(newPassword, 8);

    // MAY NOT WORK BECAUSE OF THE SELECT
    user.password = hashedPassword;

    const updatedUser = await userRepository.save(user);

    return { user: updatedUser };
  }
}

export default UpdatePasswordService;
