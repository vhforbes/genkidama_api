import nodemailer from 'nodemailer';
import AppError from '../../errors/AppError';

interface Request {
  token: string;
}

interface Response {}

class SendVerificationEmailService {
  public static async execute({ token }: Request): Promise<Response> {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'admin@genkidama.me',
        pass: 'lnnpmxdzwlczvdri',
      },
    });

    const verificationLink = `http://localhost:3333/users/verify/${token}`;

    try {
      const info = await transporter.sendMail({
        from: '"Genkidama" <admin@genkidama.me>', // sender address
        to: 'vhforbes@gmail.com', // list of receivers
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
