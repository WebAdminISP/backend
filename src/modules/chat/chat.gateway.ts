  import { Logger, OnModuleInit, UseGuards } from "@nestjs/common";
  import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
  import { Server, Socket } from "socket.io";
  import { ChatService } from "./chat.service";
  import { CustomSocket } from "./typings/ISocket";
  import { SocketAuthMiddleware } from "src/middlewares/ws.middleware";
  import { TimeoutService } from "./timeout.service";


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

      // inyecta servicios como ya sabemos
      constructor(
        private readonly chatService: ChatService,
        private readonly timeoutService: TimeoutService
      ) {}

    // almacena in memory los timeouts para cada conexion (esto se haria en db)
    private idleTimeouts: Map<string, NodeJS.Timeout> = new Map();
    private warningTimeouts: Map<string, NodeJS.Timeout> = new Map();

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
    async onModuleInit() {
      console.log('ChatGateway initialized');
      this.server.on('connection', (client: Socket) => {
        console.log(`Client attempting to connect: ${client.id}`);
        console.log('Socket handshake:', client.handshake.auth.name);

        // maneja las conexiones individualmente
        // this.handleConnection(client);
      });
    }


    //W ###### HANDLE CONNECTION (INDIVIDUAL)###################
    async handleConnection(client: Socket) {
      console.log('New client connecting');
      const { userId, isAdmin } = (client as any).user;
      const { name } = client.handshake.auth;
      console.log('User object on socket:', (client as any).user);
      console.log(name);
    
      if (!userId) {
        console.log('User not authenticated, disconnecting');
        client.disconnect();
        return;
      }
    
      console.log('User authenticated:', userId);
    
      await this.timeoutService.setupWarningTimeout(client);
      await this.timeoutService.setupIdleTimeout(client);
    
      client.on('disconnect', async () => {
        console.log(`Client Disconnected: ${client.id}`);
    
        // Find the room for this user, whether they're an admin or not
        const roomId = await this.chatService.findRoomByParticipant(userId);
        if (roomId) {
          const participants = await this.chatService.getRoomParticipants(roomId);
          if (participants) {
            if (participants.admin === userId) {
              console.log('Admin disconnected, notifying users and deleting room');
              this.server.to(roomId).emit('user-disconnected', 'El agente se ha desconectado - Chat Terminado');
    
              const userSocket = Array.from(this.server.sockets.sockets.values())
                .find(socket => (socket as any).user.userId === participants.user);
              if (userSocket) userSocket.disconnect();
    
              await this.chatService.deleteRoom(roomId);
            } else if (participants.user === userId) {
              console.log('User disconnected, removing from room');
              participants.user = null;
              if (!participants.admin) {
                console.log('No admin in the room, deleting room');
                await this.chatService.deleteRoom(roomId);
              }
            }
          }
        }
    
        this.timeoutService.clearTimeouts(client.id);
      });
    
      client.on('send-message', () => {
        this.timeoutService.resetTimeouts(client);
      });
    }

    
    // @SubscribeMessage 'escucha' evento 'create-room' emitido por cliente y dispara la funcion
    @SubscribeMessage('create-room')
    async handleCreateRoom(@ConnectedSocket() client: CustomSocket) {
      //extrae userId del usuario autenticado
      const { userId, isAdmin } = client.user;
      if(isAdmin) {
        client.emit('join-failed', 'Los admins no pueden crear salas');
        client.disconnect();
        return
      }

      // evita que el usuario pueda crear mas de 1 sala
      const existingRoom = await this.chatService.findRoomByParticipant(userId);
      if (existingRoom) {
        client.emit('join-failed', 'Ya tienes un chat abierto. No puedes crear otra sala.');
        return;
      }

      // crea una nueva room y retorna el roomId
      const response = await this.chatService.createRoom(userId);
      //agrega el cliente al room creado
      client.join(response.roomId);
      //emite evento 'room-created' informando al cliente de nueva room y su union a ella > el cliente debe estar subscrito a este evento para escucharlo
      client.emit('room-created', response);
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
      console.log(`Admin status for user ${userId}:`, isAdmin);
      // registra al usuario al diccionario/db/room, retorna true/false
      const joined = await this.chatService.joinRoom(roomId, userId, isAdmin);
      
      // si el registro es exitoso, se lo agrega al room(literalmente)
      if (joined) {
        //.join(<roomId>) agrupa al 1 cliente a este room particular
        client.join(roomId);
        //client == Socket > retorna roomId al cliente (que debe escuchar este evento)
        client.emit('room-joined', {success:'Usuario se unio a la sala',roomId});
        // notifica a TODOS los usuarios en ESA room, que alguien se conecto
        this.server.to(roomId).emit('user-joined', { success:'Usuario(Admin) se unio al chat', userId, isAdmin });
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
      const { name } = client.handshake.auth;
      const { roomId, message } = data;

      //retorna lista de usuarios en el room
      const participants = await this.chatService.getRoomParticipants(roomId);
      // verifica si el emisor es el user o admin asignados y re-emite el mensaje a todo el room 
      // esto se usa para renderizar el mansaje en la view del chat.
      if (participants && (participants.user === userId || participants.admin === userId)) {
        this.server.to(roomId).emit('new-message', {
          userId,
          name,
          roomId,
          isAdmin,
          message,
        });
        console.log('new-message:', {
          userId,
          name,
          roomId,
          isAdmin,
          message,
        })
      }
    }
  }