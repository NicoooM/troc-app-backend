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
import { AuthService } from 'src/auth/auth.service';
import jwt_decode from 'jwt-decode';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private authService: AuthService) {}
  @WebSocketServer() io: Server;
  server: Server;
  private logger: Logger = new Logger('AppGateway');

  handleConnection(client: Socket) {
    const { token } = client.handshake.headers;
    if (!token) {
      return;
    }
    if (typeof token === 'string') {
      const decoded: any = jwt_decode(token);
      const { id } = decoded;
      console.log(decoded);
      // this.authService.userOnline(id);
      // client.join(id);
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected');
  }

  afterInit(server: Server) {
    this.logger.log('Websocket server initialized');
  }

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
  handleChatMessage(@MessageBody() message: string): void {
    this.server.emit('chat', message);
  }
}
