import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendEntity } from 'src/entity/Friend.entity';
import { ResultModel, ResultState } from 'src/model/ResultModel';
import { LoginModel } from 'src/model/LoginModel';
import { CustomRepository } from 'src/repository/custom';
import { UserEntity } from 'src/entity/User.entity';
import { create } from 'domain';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendEntity)
    private readonly friendRepository: Repository<FriendEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async fetch() {
    let result = new ResultModel();
    const loginModel = LoginModel.getInstance();
    if (!loginModel.isLoggedIn()) {
      result.setCode(ResultState.conditionError);
      result.setMsg('请先登录');
      return result;
    }
    // if (LoginModel.currentUserInfo. != Authority.管理员) {
    //   result.setCode(ResultState.conditionError)
    //   result.setMsg('权限不足')
    //   return result
    // }

    try {
      const friends = await this.friendRepository.find({
        where: { userId: loginModel.currentUserInfo.userId },
      });

      const friendsInfo = await this.userRepository.find({
        where: { userId: In(friends.map((friend) => friend.friendId)) },
      });

      const list = friends.map((friend, index) => {
        return {
          userId: friend.friendId,
          createDate: friend.createDate,
          status: friend.status,
          gender: friendsInfo[index].gender,
          birthday: friendsInfo[index].birthday,
          userName: friendsInfo[index].userName,
          avatarUrl: friendsInfo[index].avatarUrl,
        };
      });

      result.setData(list);
    } catch (e) {
      console.error(e);
    } finally {
      return result;
    }
  }

  async add(req: { friendName: string }) {
    let result = new ResultModel<{ applicant: any; receiver: any }>();
    const loginModel = LoginModel.getInstance();
    if (!loginModel.isLoggedIn()) {
      result.setCode(ResultState.conditionError);
      result.setMsg('请先登录');
      return result;
    }

    const friend = await this.userRepository.findOne({
      where: { userName: req.friendName },
    });

    if (!friend) {
      result.setCode(ResultState.conditionError);
      result.setMsg('用户不存在');
      return result;
    }

    if (friend.userId == loginModel.currentUserInfo.userId) {
      result.setCode(ResultState.conditionError);
      result.setMsg('不能添加自己为好友');
      return result;
    }

    try {
      const userId = loginModel.currentUserInfo.userId;
      await Promise.all([
        this.friendRepository.insert({
          userId: userId,
          friendId: friend.userId,
        }),
        this.friendRepository.insert({
          userId: friend.userId,
          friendId: userId,
        }),
      ]);

      const users = await this.userRepository.find({
        select: ['userId', 'userName', 'avatarUrl','gender','birthday','createDate'],
        where: { userId: In([userId, friend.userId]) },
      });

      const applicant = users.find(user => user.userId === userId);
      const receiver = users.find(user => user.userId === friend.userId);

      result.setData({
        applicant,
        receiver
      });
      result.setMsg('添加成功');
    } catch (e) {
      result.setCode(ResultState.conditionError);
      result.setMsg('已经是好友了');
      result.setData(e);
    } finally {
      return result;
    }
  }

  // async delete() {
  //   let result = new ResultModel()
  //   try {
  //     var blockList = await this.BBSBlockRepository.find()
  //   } catch (e) {
  //     console.error(e)
  //   } finally {
  //     result.setData(blockList)
  //     return result
  //   }
  // }
}
