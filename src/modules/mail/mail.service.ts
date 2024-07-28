import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true para 465, false para otros puertos Utiliza STARTTLS
      auth: {
        user: 'pfpt19a@gmail.com', // Tu correo electrónico
        pass: 'ktzvmknyhpeehobi', // Tu contraseña de correo electrónico
      },
    });
  }

  private async sendMail(
    to: string,
    subject: string,
    text: string,
    html: string,
  ) {
    const mailOptions = {
      from: '"Nombre Remitente" <tu-correo@gmail.com>', // remitente
      to, // destinatario
      subject, // asunto
      text, // texto plano
      html, // HTML
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email: ', error);
      throw new InternalServerErrorException('Error sending email.');
    }
  }

  async sendRegistrationConfirmation(email: string, username: string) {
    const subject = 'Confirmación de Registro';
    const text = `Hola ${username}, gracias por registrarte en nuestro servicio PT19A.`;
    const html = `<p>Hola ${username},</p><p>Gracias por registrarte en nuestro servicio PT19A.</p>`;

    await this.sendMail(email, subject, text, html);
  }

  async sendBillingAlert(email: string, amount: number) {
    const subject = 'Alerta de Facturación';
    const text = `Tienes una factura pendiente de $${amount}.`;
    const html = `<p>Tienes una factura pendiente de <strong>$${amount}</strong>.</p>`;

    await this.sendMail(email, subject, text, html);
  }

  async sendServiceUpdate(email: string, update: string) {
    const subject = 'Actualización de Servicio';
    const text = `Hay una nueva actualización de servicio: ${update}.`;
    const html = `<p>Hay una nueva actualización de servicio:</p><p>${update}</p>`;

    await this.sendMail(email, subject, text, html);
  }
}
