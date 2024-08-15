import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { WsJwtGuard } from '../auths/auth-chat.guard';
import { TimeoutService } from './timeout.service';

@Module({
  imports: [],
  providers: [ChatGateway, ChatService, WsJwtGuard, TimeoutService],
})
export class ChatModule {}
