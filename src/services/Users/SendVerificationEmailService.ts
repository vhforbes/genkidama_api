import dotenv from 'dotenv';
import { transporter } from '../../config/nodemailer';
import AppError from '../../errors/AppError';

interface Request {
  email: string;
  token: string;
}

interface Response {}

dotenv.config();

class SendVerificationEmailService {
  public static async execute({ email, token }: Request): Promise<Response> {
    const verificationLink = `${process.env.BACKEND_URL}/users/verify/${token}`;

    try {
      const info = await transporter.sendMail({
        from: '"Genkidama" <admin@genkidama.me>', // sender address
        to: email, // list of receivers
        subject: 'Bem vindo a Genkidama!', // Subject line
        text: token, // plain text body
        html: `
        <h1>Seja bem vindo a Genkidama!</h1>
        <p>Favor confirme seu email no link abaixo</p>
        <a href="${verificationLink}">Verify email</a>`, // html body
      });

      return { info };
    } catch (error) {
      console.error(error);
      throw new AppError('Unable to send verification email');
    }
  }
}

export default SendVerificationEmailService;
