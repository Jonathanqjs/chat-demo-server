import {
  Controller,
  Get,
  Body,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  Res,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FriendsService } from '../services/friends.service';
import { LoginModel } from 'src/model/LoginModel';
import { ResultModel, ResultState } from 'src/model/ResultModel';
import { FriendEntity } from 'src/entity/Friend.entity';
import { SocketGateway } from '../socket.gateway';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname, dirname, join } from 'path';
import { MessageService } from '../services/message.service';
import { Response,Request } from 'express';
import * as fs from 'fs/promises';
import * as util from 'util';
import { createHash } from 'crypto';

@Controller('message')
export class MessageController {
  constructor(
    private readonly socketGateway: SocketGateway,
    private readonly messageService: MessageService,
  ) {}

  @Post('sendImage')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadPath = join(__dirname, '..', 'upload'); // 构建绝对路径
          callback(null, uploadPath);
        }, // 文件保存路径
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!req.body.receiverId) {
          return callback(new Error('receiverId is missing '), false);
        }
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|octet-stream)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async sendImage(@Body() req, @UploadedFile() file): Promise<ResultModel<any>> {
    const result =await  this.messageService.sendImage(req, file);
    this.socketGateway.sendMessageToClient(result);
    return result;
  }

  @Get('getImage/:filename')
  async getImage(@Param('filename') filename: string, @Res() res: Response): Promise<void> {
    const uploadPath = join(__dirname, '..', 'upload', filename);
    try {
      await fs.access(uploadPath);
      res.sendFile(uploadPath);
    } catch (error) {
      throw new NotFoundException('Image not found');
    }
  }

}
