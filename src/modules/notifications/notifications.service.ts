import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import { MailService } from '../mail/mail.service';

@Injectable()
export class NotificationsService {
  constructor(public readonly mailService: MailService) {}

  onModuleInit() {
    this.scheduleTasks();
  }

  private scheduleTasks() {
    // Programar una tarea para enviar recordatorios y pre-facturas el primer día de cada mes a las 9 AM
    cron.schedule('0 9 1 * *', async () => {
      //await this.sendMonthlyNotifications();
    });
  }

  // private async sendMonthlyNotifications() {
  //   // Aquí deberías implementar la lógica para obtener los usuarios y enviar las notificaciones
  //   const users = await this.getUsersToNotify();
  //   for (const user of users) {
  //     await this.sendNotification(user);
  //   }
  // }

  private async getUsersToNotify() {
    // Implementa la lógica para obtener los usuarios desde la base de datos
    return [
      { email: 'user1@example.com', name: 'User 1' },
      { email: 'user2@example.com', name: 'User 2' },
    ];
  }

  // private async sendNotification(user: { email: string; name: string }) {
  //   // Implementa la lógica para enviar el correo electrónico
  //   const emailContent = this.generateEmailContent(user);
  //   await this.mailService.sendMail(
  //     user.email,
  //     'Recordatorio y Pre-factura Mensual',
  //     emailContent,
  //   );
  // }

  private generateEmailContent(user: { email: string; name: string }): string {
    // Genera el contenido del correo electrónico
    return `Hola ${user.name},\n\nEste es tu recordatorio y pre-factura del mes.\n\nSaludos,\nEl Equipo`;
  }
}
