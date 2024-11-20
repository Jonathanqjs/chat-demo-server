import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {isMainThread,Worker} from 'worker_threads'
import { LoginModule } from './services/login/login.module';
import AppMiddleware from './app.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UserEntity } from './entity/User.entity';
import { typeOrmConfig } from './config/config';
import { ChatModule } from './services/chat/chat.module';

@Module({
  imports: [LoginModule, ChatModule,TypeOrmModule.forRoot(typeOrmConfig)],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  constructor(private readonly connection: Connection) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppMiddleware).forRoutes({path: "*" ,method:RequestMethod.ALL})
  }
  
}


