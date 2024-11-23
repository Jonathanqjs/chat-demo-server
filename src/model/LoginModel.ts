import { Req } from '@nestjs/common';
import { Request } from 'express';
import { Util } from 'src/util/util';
import { UserEntity } from '../entity/User.entity';
import Redis from 'ioredis';
import { redisConfig } from 'src/config/config';

export class LoginModel {
  private static instance: LoginModel;
  private loginMap: { [token: string]: UserEntity } = {};
  private redisClient: Redis;
  public currentUserInfo: UserEntity;
  private expireTime = 60 * 60 * 24 * 7;
  private constructor() {
    this.redisClient = new Redis(redisConfig);
  }

  // 获取单例实例
  public static getInstance(): LoginModel {
    if (!LoginModel.instance) {
      LoginModel.instance = new LoginModel();
    }
    return LoginModel.instance;
  }

  // 是否已经登录
  public isLoggedIn(): boolean {
    return !!this.currentUserInfo;
  }

  // 检查 token 是否存在
  public async isContain(token: string): Promise<boolean> {
    return !!(await this.getLoginInfo(token));
  }

  // 获取登录信息
  public async getLoginInfo(token: string): Promise<UserEntity | null> {
    this.redisClient.select(1);
    const info = await this.redisClient.get(token);
    return info ? JSON.parse(info) : null;
  }

  public async addLoginInfo(
    token: string,
    userInfo: UserEntity,
  ): Promise<void> {
    this.redisClient.select(1);
    await this.redisClient.set(
      token,
      JSON.stringify(userInfo),
      'EX',
      this.expireTime,
    );
  }

  public async removeLoginInfo(token: string): Promise<void> {
    this.redisClient.select(1);
    await this.redisClient.del(token);
  }

  public async SetTokenById(userId,token) {
    this.redisClient.select(2);
    await this.redisClient.set(
      userId,
      token,
      'EX',
      this.expireTime,
    )
  }

  public async getTokenById(userId) {
    this.redisClient.select(2);
    const token = await this.redisClient.get(userId);
    return token ?? null;
  }

  public async removeTokenById(userId) {
    this.redisClient.select(2);
    await this.redisClient.del(userId);
  }
}
