import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'SendinBlue',
  auth: {
    user: 'vhforbes@gmail.com',
    pass: 'D5QEBZxvOqygt1XN',
  },
});
