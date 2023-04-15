import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import jwt_decode from 'jwt-decode';
import { UsersService } from 'src/users/users.service';
import { ConnectedUsersService } from 'src/connected-users/connected-users.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { MessagesService } from 'src/messages/messages.service';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private usersService: UsersService,
    private connectedUsersService: ConnectedUsersService,
    private roomsService: RoomsService,
    private messagesService: MessagesService,
  ) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  async handleConnection(client: Socket) {
    const { token } = client.handshake.headers;
    if (!token) {
      return;
    }
    if (typeof token === 'string') {
      const decoded: any = jwt_decode(token);
      const { email } = decoded;
      const user = await this.usersService.findOne(email);
      client.data.user = user;
      await this.connectedUsersService.create({ socketId: client.id, user });
      // const rooms = await this.roomsService.findAll(user);
      // rooms.forEach((room) => {
      //   this.handleJoinRoom(client, room.id.toString());
      // });
    }
  }

  async handleDisconnect(client: Socket) {
    const { user } = client.data;
    if (!user) {
      return;
    }
    await this.connectedUsersService.remove(client.id);
    console.log('Client disconnected');
  }

  afterInit(server: Server) {
    this.logger.log('Websocket server initialized');
  }

  // handleJoinRoom(client: Socket, room: string) {
  //   const { user } = client.data;
  //   if (!user) {
  //     return;
  //   }
  //   client.join(room);
  //   this.server.to(room).emit('chat', `${user.username} joined`);
  // }

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  @SubscribeMessage('chat')
  async handleChatMessage(client: Socket, payload: CreateMessageDto) {
    const { user } = client.data;
    payload.sender = user;

    const room = await this.roomsService.findOne(user, {
      receiverId: payload.receiver,
    });

    if (!room) {
      throw new Error(`Could not find room with id ${payload.room}`);
    }

    payload.room = room.id;

    const message = await this.messagesService.create(payload);

    const connectedUser = await this.connectedUsersService.findByUserId(
      payload.receiver,
    );

    this.server.to(client.id).emit('chat', message);
    if (connectedUser) {
      this.server.to(connectedUser.socketId).emit('chat', message);
    }
  }
}
