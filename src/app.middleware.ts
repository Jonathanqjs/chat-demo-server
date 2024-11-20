import { NestMiddleware, Injectable, Req, Res, Next } from "@nestjs/common";
import { Request, Response } from 'express'
import { LoginModel } from "./model/LoginModel";
import { ResultModel, ResultState } from "./model/ResultModel";
import { Util } from "./util/util";
import { UserEntity } from './entity/User.entity';

@Injectable()
class AppMiddleware implements NestMiddleware {
  async use(@Req() req: Request, res: Response, next: () => void) {
    res.setHeader('Access-Control-Allow-Origin', req.hostname)
    const loginModel = LoginModel.getInstance()
    loginModel.currentUserInfo = await loginModel.getLoginInfo(req.cookies?.token) 
    // next()
    if (req.originalUrl.startsWith('/user/')) {
      next()
    } else {
      this.loginInterceptor(req, res, next)
    }
  }

  async loginInterceptor(req: Request, res: Response, next) {
    const loginModel = LoginModel.getInstance()
    let result = new ResultModel()
    if (await loginModel.isContain(req.cookies?.token)) {
      next()
    } else {
      result.setCode(ResultState.conditionError)
      result.setMsg('登录已超时')
      res.send(result)
    }
  }

}

export default AppMiddleware