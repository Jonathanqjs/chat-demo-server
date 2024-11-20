import { Injectable, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ResultModel, ResultState } from 'src/model/ResultModel';
import { LoginModel } from 'src/model/LoginModel';
import { Util } from 'src/util/util';
import { UserEntity } from 'src/entity/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoginService {

  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) { }

  generateUUID(): string {
    return uuidv4();
  }

  async isLogin() {
    let result = new ResultModel()
    const loginModel = LoginModel.getInstance()
    result.setData(loginModel.isLoggedIn())
    return result
  }

  async login(req: Request) {
    let result = new ResultModel()
    let body:LoginRequest = req.body
    const loginModel = LoginModel.getInstance()
    if (!Reflect.has(body, 'userName')) {
      result.setCode(ResultState.parameterError)
      result.setMsg('请输入用户名')
      return [result]
    }

    if (!Reflect.has(body, 'password')) {
      result.setCode(ResultState.parameterError)
      result.setMsg('请输入密码')
      return [result]
    }

    let user = await this.userRepository.findOne({
      where: { userName: body.userName }
    })
    if (!user ||Util.AESDecrypt(user.password) != body.password) {
      result.setCode(ResultState.parameterError)
      result.setMsg('用户名或密码错误')
      return [result]
    }

    if (await loginModel.isContain(req.cookies?.token) && loginModel.currentUserInfo.userId == user.userId) {
      result.setCode(ResultState.conditionError)
      result.setMsg('该用户已经登录，请勿重复登录')
      return [result]
    } else {
      let token = this.generateUUID()
      delete user.password
      const previousToken =await loginModel.getTokenById(user.userId)
      if(previousToken) {
        await loginModel.removeLoginInfo(previousToken)
      }
      await Promise.all([
        loginModel.SetTokenById(user.userId,token),
        loginModel.addLoginInfo(token,user)
      ])   
      result.setCode(ResultState.success)
      result.setMsg('登录成功')
      result.setData(user)
      return [result, token]
    }
  }

  

  async logout(req: Request) {
    let result = new ResultModel()
    let cookie = req.cookies
    const loginModel = LoginModel.getInstance()
    if (!loginModel.isLoggedIn()) {
      result.setCode(ResultState.parameterError)
      result.setMsg('用户尚未登录，请重新登录')
    } else {
      await Promise.all([
        loginModel.removeTokenById(loginModel.currentUserInfo.userId),
        loginModel.removeLoginInfo(cookie.token)
      ]) 
      
    }
    return result
  }

  async register(req:RegisterRequest) {
    let result = new ResultModel()
    let user = await this.userRepository.findOne({
      where: { userName: req.userName }
    })
    if (user) {
      result.setMsg('该用户名已被注册')
      result.setCode(ResultState.parameterError)
      return result
    }
    // if (!Util.judgePassword(req.password)) {
    //   result.setMsg('密码设置过于简单')
    //   result.setCode(ResultState.parameterError)
    //   return result
    // }
    try {
      await this.userRepository.insert(
        {
          userName: req.userName,
          password:Util.AESEncrypt(req.password),
        }
      )
      return result
    }catch(e) {
      result.setCode(ResultState.conditionError)
      result.setMsg(e)
      return result
    }
  }

  async changPwd(req:changePwdRequest) {
    let result = new ResultModel()
    const loginModel = LoginModel.getInstance()
    if (!loginModel.currentUserInfo) {
      result.setCode(ResultState.parameterError)
      result.setMsg('用户尚未登录，请重新登录')
      return result
    }

    let user = await this.userRepository.findOne({
      where: { userName: loginModel.currentUserInfo.userName }
    })

    if (!user) {
      result.setCode(ResultState.parameterError)
      result.setMsg('没有该用户')
      return result
    }
    if (Util.AESDecrypt(user.password) != req.oldPassword) {
      result.setCode(ResultState.parameterError)
      result.setMsg('用户密码错误')
      return result
    }

    // if (!Util.judgePassword(req.newPassword)) {
    //   result.setCode(ResultState.parameterError)
    //   result.setMsg('用户新密码过于简单')
    //   return result
    // }

    try {
      await this.userRepository.update({
        userName: loginModel.currentUserInfo.userName
      }, { password: Util.AESEncrypt(req.newPassword) })
    }
    finally {
      return result
    }
  }

  async queryInfo(req:Request) {
    let result = new ResultModel()
    const loginModel = LoginModel.getInstance()
    if(!loginModel.isLoggedIn()) {
      result.setCode(ResultState.conditionError)
      result.setMsg('用户尚未登录，请重新登录')
      return result
    } 

    result.setData(loginModel.currentUserInfo) 
    return result
    
  }
}
