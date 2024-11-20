import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './services/message.service';
import { Logger } from '@nestjs/common';
import { LoginModel } from 'src/model/LoginModel';
import { ResultModel } from 'src/model/ResultModel';

@WebSocketGateway({
  namespace: 'socket',
  // cors: {
  //   origin: '*',
  // },
})
export class SocketGateway implements OnGatewayInit,OnGatewayConnection {

  constructor(private readonly messageService: MessageService) {}

  @WebSocketServer()
  server: Server;

  private users = new Map<string, Socket>(); // 存储用户ID和连接的映射
  
  private readonly logger = new Logger(SocketGateway.name);
  
  afterInit(server: any) {
    // throw new Error('Method not implemented.');
    this.logger.log("Initialized");
  }

  async getUserByToken(token: string) {
    const loginModel = LoginModel.getInstance()
    loginModel.currentUserInfo =await loginModel.getLoginInfo(token)
    return loginModel.currentUserInfo
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.query.token as string;
    const user = await this.getUserByToken(token)
    this.logger.log(`Client token: ${token} connected`);
    if (user) {
      const userId = user.userId;
      this.users.set(userId.toString(), client); // 将用户ID和连接存储
      this.logger.log(`User ${userId} connected`);

      const result =  await this.messageService.fetch(userId)
      client.emit('connectionSuccess', result);
    } else {
      this.logger.error('User not login')
      client.disconnect();
    }
  }

  // async handleDisconnect(client: Socket) {
  //   const token = client.handshake.query.token as string;
  //   const user = await this.getUserByToken(token)
  //   if (user) {
  //     const userId = user.userId;
  //     // this.users.delete(userId.toString()); // 连接断开时删除映射
  //     this.logger.log(`User ${userId} disconnected`);
  //   }
  // }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: { receiverId: number; content: string }, 
  ) {
    const token = client.handshake.query.token as string;
    const user = await this.getUserByToken(token)
    const { receiverId, content } = payload;
    

    const result =await this.messageService.addMessage({
      senderId: user?.userId,
      receiverId,
      content: content,
    });

    this.sendMessageToClient(result);

  }

  sendMessageToClient(result: ResultModel<any>) {
    const senderId = result.data.senderId.toString();
    const receiverId = result.data.receiverId.toString();
    const senderClient = this.users.get(senderId);
    const receiverClient = this.users.get(receiverId);
    senderClient?.emit('receiveMessage', result);
    if (receiverClient) {
      receiverClient.emit('receiveMessage', result);
    } else {
      console.log(`User ${receiverId} not connected`);
    }
  }

  async handleAddFriend(receiverId:number,result: ResultModel<any>) {
    const receiverClient = this.users.get(receiverId.toString());
    if (receiverClient) {
      receiverClient.emit('addFriend', result);
    }
  }
}
