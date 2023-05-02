import { AppDataSource } from '../../data-source';
import User from '../../models/User';
import AppError from '../../errors/AppError';

import { sign } from 'jsonwebtoken';

import { transporter } from '../../config/nodemailer';
import resetPassword from '../../config/resetPassword';

interface Request {
  email: string;
}

const frontEndUrl = process.env.FRONTEND_URL;

class SendPasswordResetLinkSerivce {
  public static async execute({ email }: Request): Promise<void> {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { email },
    });

    // Do nothing if there is no user
    if (!user) {
      throw new AppError(
        'Usuário não encontrado para envio do email de recuperação.',
      );
    }

    let token = sign({ email }, resetPassword.jwt.secret, {
      expiresIn: resetPassword.jwt.expiresIn,
    });

    const recoveryLink = `${frontEndUrl}/users/recover?token=${token}`;

    try {
      await transporter.sendMail({
        from: '"Genkidama" <admin@genkidama.me>', // sender address
        to: user.email, // list of receivers
        subject: 'Recupere sua senha!', // Subject line
        text: token, // plain text body
        html: `
        <h1>Vamos recuperar sua senha!</h1>
        <p>Favor redefina sua senha no link abaixo:</p>
        <a href="${recoveryLink}">Clique aqui!</a>`, // html body
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      throw new AppError('Unable to send recovery email');
    }
  }
}

export default SendPasswordResetLinkSerivce;
