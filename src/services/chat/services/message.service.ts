import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendEntity } from 'src/entity/Friend.entity';
import { ResultModel, ResultState } from 'src/model/ResultModel';
import { LoginModel } from 'src/model/LoginModel';
import { CustomRepository } from 'src/repository/custom';
import { UserEntity } from 'src/entity/User.entity';
import { create } from 'domain';
import { MessagesEntity } from 'src/entity/Messages.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessagesEntity)
    private readonly messageRepository: Repository<MessagesEntity>,
    @InjectRepository(UserEntity) 
    private readonly userRepository: Repository<UserEntity>) {
  }

  async fetch(userId:number) {
    let result = new ResultModel()
    const loginModel = LoginModel.getInstance();
    if(!loginModel.isLoggedIn()) {
      result.setCode(ResultState.conditionError)
      result.setMsg('请先登录')
      return result
    }

    try {
      const id = userId ?? loginModel.currentUserInfo.userId;
      const messagesList =(await Promise.all([
        this.messageRepository.find({
          where: { senderId: id }
        }),
        this.messageRepository.find({
          where: { receiverId: id }
        })
      ])).flat()


      result.setData(messagesList)
    } catch (e) {
      console.error(e)
    } finally {
      return result
    }
  }

  async sendImage(req:{receiverId:string}, file) {
    const result = new ResultModel()
    if (!file) {
      result.setCode(ResultState.conditionError);
      result.setMsg('No file uploaded');
      return result;
    }
    const loginModel = LoginModel.getInstance();
    const user = loginModel.currentUserInfo
    try {
      // 处理上传的文件，例如保存文件路径到数据库
      const res =await this.messageRepository.insert({
        senderId: user.userId,
        receiverId: parseInt(req.receiverId),
        content: '',
        mediaUrl: file.filename,
      })
      result.setData({
        senderId: user.userId,
        receiverId: parseInt(req.receiverId),
        ...res.generatedMaps[0]})
      
    } catch (error) {
      result.setCode(ResultState.conditionError);
      result.setMsg('File upload failed');
    }
    return result;
    
  }


  async addMessage(req:Partial<MessagesEntity>) {
    let result = new ResultModel()
    if(!req.senderId) {
      result.setCode(ResultState.conditionError)
      result.setMsg('登录已超时')
      return result 
    }

    try {
      const res =await this.messageRepository.insert({
          senderId: req.senderId,
          receiverId: req.receiverId,
          content: req.content,
          mediaUrl: req.mediaUrl,
        })
      
      result.setMsg('发送成功')
      result.setData({
        senderId: req.senderId,
        receiverId: req.receiverId,
        ...res.generatedMaps[0]})
    } catch (e) {
      console.error(e)
    } finally {
      return result
    }
  }

}
