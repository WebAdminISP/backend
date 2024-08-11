import { Logger, OnModuleInit, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { CustomSocket } from "./typings/ISocket";
import { SocketAuthMiddleware } from "src/middlewares/ws.middleware";


@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
// @UseGuards(WsJwtGuard) > esto no sirve en una app hibrida
export class ChatGateway implements OnGatewayInit, OnModuleInit, OnGatewayConnection {

  // inyecta una instancia del ws server. Es todo el objecto server en si.
  // provee metodos para conectar, desconectar, emitir eventos,broadcasting, manejar rooms, etc
  @WebSocketServer()
  public server: Server;

  // afterInit > momento en que se inicializa el ws server pero antes de haber una conexion, o sea, Nestjs instancia esta clase.
  // Aqui se lleva a cabo la autenticacion del usuario llamando a un middleware que a su vez llama al WsJwtGuard. Esta guard agrega el objeto user al payload.
  // Socket > es la conexion individual entre el server y 1 cliente especifico
  // metodos varios de conexion, desconexion, leave, join, etc.
  afterInit(client:Socket){
    client.use(SocketAuthMiddleware() as any);
    Logger.log('Application Loaded Up: from ChatGateway')
  }

  // OnModuleInit > momento en que el ChatModule esta completamente inicializado(instanciado)
  // 'connection' es un evento global para todas las conexiones ws.
  onModuleInit() {
    console.log('ChatGateway initialized');
    this.server.on('connection', (client: Socket) => {
      console.log(`Client attempting to connect: ${client.id}`);
      console.log('Socket handshake:', client.handshake);

      // maneja las conexiones individualmente
      this.handleConnection(client);
    });
  }

  // handleConnection > momento en que ocurre una conexion al server
  // maneja cada conexion individual cuando ya fue establecida.
  handleConnection(client: Socket) {
    console.log('New client connecting');
    console.log('User object on socket:', (client as any).user);
    //si no hay objecto user en el payload, desconecta
    //esto era para debugging, no es realmente util ahora que funciona
    if (!(client as any).user) {
      console.log('User not authenticated, disconnecting');
      client.disconnect();
    } else {
      console.log('User authenticated:', (client as any).user);
    }

    // Handle disconnection event
    client.on('disconnect', () => {
      console.log(`Client Disconnected: ${client.id}`);
    });
  }

  // inyecta el servicio como ya sabemos
  constructor(private readonly chatService: ChatService) {}

  
  // @SubscribeMessage 'escucha' evento 'create-room' emitido por cliente y dispara la funcion
  @SubscribeMessage('create-room')
  async handleCreateRoom(@ConnectedSocket() client: CustomSocket) {
    //extrae userId del usuario autenticado
    const { userId } = client.user;
    // crea una nueva room y retorna el roomId
    const roomId = await this.chatService.createRoom(userId);
    //agrega el cliente al room creado
    client.join(roomId);
    //emite evento 'room-created' informando al cliente de nueva room y su union a ella > el cliente debe estar subscrito a este evento para escucharlo
    client.emit('room-created', roomId);
  }

  // escucha evento 'join-room' del usuario (user o admin), ejecuta funcion.
  //recibe roomId y socket client
  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: CustomSocket
  ) {
    // extrae userId y si es o no Admin
    const { userId, isAdmin } = client.user;
    // registra al usuario al diccionario/db/room, retorna true/false
    const joined = await this.chatService.joinRoom(roomId, userId, isAdmin);
    
    // si el registro es exitoso, se lo agrega al room(literalmente)
    if (joined) {
      //.join(<roomId>) agrupa al 1 cliente a este room particular
      client.join(roomId);
      //client == Socket > retorna roomId al cliente (que debe escuchar este evento)
      client.emit('room-joined', roomId);
      // notifica a TODOS los usuarios en ESA room, que alguien se conecto
      this.server.to(roomId).emit('user-joined', { userId, isAdmin });
    } else {
      // emite evento para join-failed
      client.emit('join-failed', 'Unable to join room');
    }
  }

  // escucha evento 'send-message', recibe data del room+mensaje y el usuario emisor
  @SubscribeMessage('send-message')
  async handleMessage(
    @MessageBody() data: { roomId: string; message: string },
    @ConnectedSocket() client: CustomSocket
  ) {
    // desestructura la info entrante
    const { userId, isAdmin } = client.user;
    const { roomId, message } = data;

    //retorna lista de usuarios en el room
    const participants = await this.chatService.getRoomParticipants(roomId);
    // verifica si el emisor es el user o admin asignados y re-emite el mensaje a todo el room 
    // esto se usa para renderizar el mansaje en la view del chat.
    if (participants && (participants.user === userId || participants.admin === userId)) {
      this.server.to(roomId).emit('new-message', {
        userId,
        isAdmin,
        message
      });
    }
  }
}