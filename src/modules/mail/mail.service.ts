import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { config as dotenvConfig } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenvConfig({ path: '.env.development' });

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true', // true para 465, false para otros puertos Utiliza STARTTLS
      auth: {
        user: process.env.SMTP_USER, // Tu correo electrónico
        pass: process.env.SMTP_PASSWORD, // Tu contraseña de aplicación de Google
      },
    });
  }

  private async sendMail(
    to: string,
    subject: string,
    text: string,
    html: string,
    attachments?: { filename: string; path: string }[],
  ) {
    const mailOptions = {
      from: '"UltraNet" <tu-correo@gmail.com>', // remitente
      to, // destinatario
      subject, // asunto
      text, // texto plano
      html, // HTML
      attachments, // adjuntos
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

  // Método para enviar notificaciones mensuales
  async sendMonthlyNotification(email: string, username: string) {
    const subject = 'Recordatorio y Pre-factura Mensual';
    const text = `Hola ${username},\n\nEste es tu recordatorio y pre-factura del mes.\n\nSaludos,\nEl Equipo`;
    const html = `<p>Hola ${username},</p><p>Este es tu recordatorio y pre-factura del mes.</p><p>Saludos,<br>El Equipo</p>`;

    await this.sendMail(email, subject, text, html);
  }

  // Método para enviar notificaciones mensuales con archivo adjunto
  async sendMonthlyNotificationWithAttachment(
    email: string,
    username: string,
    filePath: string,
  ) {
    const subject = 'Recordatorio y Pre-factura Mensual';
    const text = `Hola ${username},\n\nEste es tu recordatorio y pre-factura del mes.\n\nSaludos,\nEl Equipo`;
    const html = `<p>Hola ${username},</p><p>Este es tu recordatorio y pre-factura del mes.</p><p>Saludos,<br>El Equipo</p>`;
    const attachments = [{ filename: path.basename(filePath), path: filePath }];

    await this.sendMail(email, subject, text, html, attachments);
  }
}
