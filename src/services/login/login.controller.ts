import { Controller, Post, Req, Body, Res, } from '@nestjs/common';
import { Response,Request } from 'express';
import { ResultModel } from 'src/model/ResultModel';
import { LoginService } from './login.service';

@Controller('user')
export class LoginController {
  constructor(private readonly loginService: LoginService) {

  }

  @Post('isLogin')
  async isLogin(@Req() req: Request) {
    return await this.loginService.isLogin()
  }


  @Post('login')
  async login(@Req() req: Request,@Res() res:Response) {
    // return res.send(await this.loginService.login(req,res))
    const [result,token] = await this.loginService.login(req)
    if(token) {
      console.log('token:',token)
      res.cookie('token', token, { expires: new Date(Date.now() + 1000*60*60*24*7), httpOnly: true })
    }
    res.send(result)
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    return await this.loginService.logout(req)
  }

  @Post('register')
  async register(@Body() req:RegisterRequest) {
    return await this.loginService.register(req)
  }

  @Post('changePwd')
  async changePwd(@Body() req:changePwdRequest) {
    return await this.loginService.changPwd(req)
  }

  @Post('queryInfo')
  async queryInfo(@Req() req) {
    return await this.loginService.queryInfo(req)
  }

}
