import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import { MailService } from '../mail/mail.service'; // Asumiendo que tienes un servicio de correo configurado

@Injectable()
export class NotificationsService {
  constructor(private readonly mailService: MailService) {}

  onModuleInit() {
    this.scheduleTasks();
  }

  private scheduleTasks() {
    // Programar una tarea para enviar recordatorios y pre-facturas el primer día de cada mes a las 9 AM
    cron.schedule('0 9 1 * *', async () => {
      await this.sendMonthlyNotificationsWithAttachments();
    });
  }

  private async sendMonthlyNotificationsWithAttachments() {
    // Aquí deberías implementar la lógica para obtener los usuarios y enviar las notificaciones
    const users = await this.getUsersToNotify();
    const filePath = 'path/to/your/invoice.pdf'; // Ajusta la ruta del archivo según sea necesario

    for (const user of users) {
      await this.sendNotificationWithAttachment(user, filePath);
    }
  }

  private async getUsersToNotify() {
    // Implementa la lógica para obtener los usuarios desde la base de datos
    return [
      { email: 'user1@example.com', name: 'User 1' },
      { email: 'user2@example.com', name: 'User 2' },
    ];
  }

  private async sendNotificationWithAttachment(
    user: { email: string; name: string },
    filePath: string,
  ) {
    // Implementa la lógica para enviar el correo electrónico con el archivo adjunto utilizando el método específico de MailService
    await this.mailService.sendMonthlyNotificationWithAttachment(
      user.email,
      user.name,
      filePath,
    );
  }

  private async sendNotification(user: { email: string; name: string }) {
    // Implementa la lógica para enviar el correo electrónico utilizando el método específico de MailService
    await this.mailService.sendMonthlyNotification(user.email, user.name);
  }
}
