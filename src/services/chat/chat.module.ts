import { Module, NestModule } from '@nestjs/common';
import { FriendsController } from './controller/friends.controller';
import { FriendsService } from './services/friends.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entity/User.entity';
import { FriendEntity } from 'src/entity/Friend.entity';
import { MiddlewareBuilder } from '@nestjs/core';
import { MessagesEntity } from 'src/entity/Messages.entity';
import { SocketGateway } from './socket.gateway';
import { MessageService } from './services/message.service';
import { MessageController } from './controller/message.controller';

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity,FriendEntity,MessagesEntity])],
  controllers:[FriendsController,MessageController],
  providers:[FriendsService,SocketGateway,MessageService],
  exports: [SocketGateway]
})
export class ChatModule {

}
