import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MailService } from '../mail/mail.service';

@Module({
  providers: [NotificationsService, MailService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
