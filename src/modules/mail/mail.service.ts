import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Utiliza tu proveedor de SMTP
      port: 587,
      secure: false, // true para 465, false para otros puertos Utiliza STARTTLS
      auth: {
        user: 'pfpt19a@gmail.com', // Tu correo electrónico
        pass: '20pt19a24', // Tu contraseña de correo electrónico
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html: string) {
    const mailOptions = {
      from: '"PF PT19A" <pfpt19a@gmail.com>', // Remitente
      to, // Destinatario
      subject, // Asunto
      text, // Texto plano
      html, // HTML
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
