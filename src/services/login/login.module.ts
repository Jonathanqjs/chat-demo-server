import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { UserEntity } from 'src/entity/User.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity])],
  controllers: [LoginController],
  providers: [LoginService]
})
export class LoginModule {}
