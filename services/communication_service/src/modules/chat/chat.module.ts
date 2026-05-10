import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ExternalModule } from '../external/external.module';
import { ChatController } from './chat.controller';
import { ChatEventsService } from './chat-events.service';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { InstructorChatController } from './instructor-chat.controller';

@Module({
  imports: [AuthModule, ExternalModule],
  controllers: [ChatController, InstructorChatController],
  providers: [ChatService, ChatEventsService, ChatGateway],
  exports: [ChatService, ChatEventsService],
})
export class ChatModule {}
