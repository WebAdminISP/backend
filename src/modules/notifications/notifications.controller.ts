import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Notificaciones')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly mailService: MailService) {}

  @Post('register')
  async sendRegistrationConfirmation(
    @Body() body: { email: string; username: string },
  ) {
    const { email, username } = body;
    await this.mailService.sendRegistrationConfirmation(email, username);
  }

  @Post('billing')
  async sendBillingAlert(@Body() body: { email: string; amount: number }) {
    const { email, amount } = body;
    await this.mailService.sendBillingAlert(email, amount);
  }

  @Post('update')
  async sendServiceUpdate(@Body() body: { email: string; update: string }) {
    const { email, update } = body;
    await this.mailService.sendServiceUpdate(email, update);
  }
}
