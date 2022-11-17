import nodemailer from 'nodemailer';
import AppError from '../../errors/AppError';

interface Request {
  token: string;
}

interface Response {}

class SendVerificationEmailService {
  public static async execute({ token }: Request): Promise<Response> {
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'tyra.gleichner35@ethereal.email',
        pass: '2xc9RdVNyajgzEm8Pz',
      },
    });

    const verificationLink = `http://localhost:3333/users/verify/${token}`;

    try {
      const info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: 'vhforbes@gmail.com>', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: token, // plain text body
        html: `<a href="${verificationLink}">Verify email</a>`, // html body
      });

      return { info };
    } catch (error) {
      throw new AppError('Unable to send verification email');
    }
  }
}

export default SendVerificationEmailService;
