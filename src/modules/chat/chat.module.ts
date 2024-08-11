import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { WsJwtGuard } from '../auths/auth-chat.guard';

@Module({
  imports: [],
  providers: [ChatGateway, ChatService, WsJwtGuard],
})
export class ChatModule {}
