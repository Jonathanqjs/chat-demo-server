import { Controller, Get, Body, Post } from '@nestjs/common';
import { FriendsService } from '../services/friends.service';
import { LoginModel } from 'src/model/LoginModel';
import { ResultModel, ResultState } from 'src/model/ResultModel';
import { FriendEntity } from 'src/entity/Friend.entity';
import { SocketGateway } from '../socket.gateway';

@Controller('friends')
export class FriendsController {
  constructor(
    private readonly friendsService: FriendsService,
    private readonly socketGateway: SocketGateway,
  ) {}

  @Post('fetch')
  async fetch(@Body() req) {
    return await this.friendsService.fetch();
  }

  @Post('add')
  async add(@Body() req) {
    const result = await this.friendsService.add(req);
    if (result.code === ResultState.success) {
      const receiver =result.data.receiver;
      this.socketGateway.handleAddFriend(receiver.userId,result);
    }
    return result;
  }

  // @Post('delete')
  // async delete(){
  //   return await this.friendsService.delete()
  // }
}
