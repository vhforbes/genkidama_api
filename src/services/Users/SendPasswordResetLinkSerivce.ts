import { AppDataSource } from '../../data-source';
import User from '../../models/User';
import AppError from '../../errors/AppError';

import { sign } from 'jsonwebtoken';

import { transporter } from '../../config/nodemailer';
import resetPassword from '../../config/resetPassword';

interface Request {
  email: string;
}

interface Response {}

class SendPasswordResetLinkSerivce {
  public static async execute({
    email,
  }: Request): Promise<Response | undefined> {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { email },
    });

    // Do nothing if there is no user
    if (!user) return;

    let token = sign({ email }, resetPassword.jwt.secret, {
      expiresIn: resetPassword.jwt.expiresIn,
    });

    const recoveryLink = `http://localhost:3333/users/recover/?token=${token}`;

    try {
      await transporter.sendMail({
        from: '"Genkidama" <admin@genkidama.me>', // sender address
        to: 'vhforbes@gmail.com', // list of receivers
        subject: 'Bem vindo a Genkidama!', // Subject line
        text: token, // plain text body
        html: `
        <h1>Vamos recuperar sua senha!</h1>
        <p>Favor redefina sua senhano link abaixo:</p>
        <a href="${recoveryLink}">Verify email</a>`, // html body
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw new AppError('Unable to send recovery email');
    }
  }
}

export default SendPasswordResetLinkSerivce;
