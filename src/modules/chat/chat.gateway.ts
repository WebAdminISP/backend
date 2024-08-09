import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors:{
    origin: '*'
  }
})
export class ChatGateway implements OnModuleInit {

  //w canaliza/conoce todas las conexiones
  @WebSocketServer()
  public server: Server

  constructor(private readonly chatService: ChatService) {}

   //*##############################
  //* ####### manejo de respuestas automaticas ante conexion y desconexion 
  //*##############################
  onModuleInit() {
    //w escucha cada nueva conexion y desconexion (built-in event)
    this.server.on('connection',(socket:Socket)=>{
      console.log(`Cliente Conectado: ${socket.id}`)
      // console.log('######Asi se ve un socket######', socket)

      //w asi recibimos info enviada al server > objecto handshake
      const {name, token} = socket.handshake.auth;
      console.log({name, token})

      //? verifica si !nombre entonces desconecta el socket
      if(!name) {
        socket.disconnect();
        return;
      }

      //? si hay un nombre, hay un cliente conectado > lo agrego al listado
      //! ACA, usariamos el id del usuario en base de datos, no el del socket >  en caso de una desconexion, el socket.id cambia, el id del usuario no.
      this.chatService.onClientConnected({id:socket.id, name:name})

      //? Mensaje de Bienvenida / 'Aguarde, un agente se esta conectando...'
      //? este mensaje solo aparece para el usuario que se conecta, no se repite a los ya conectados. > no confudir con this.server.emit == broadcasting
      socket.emit('welcome-message', 'Bienvenido, un agente se esta conectando...')

      //? Broadcasting > enviar listado de conectados al conectarse un nuevo usuario
      //? esto lo toma el front para mostrar la lista de conectados por ejemplo
      this.server.emit('on-clients-changed', this.chatService.getClients());

      //? escucha cuando cliente se desconecta (built-in event)
      socket.on('disconnect', ()=>{
        this.chatService.onClientDisconnected(socket.id)
        //? envio la lista actualizada de nuevo
        this.server.emit('on-clients-changed', this.chatService.getClients());
        console.log(`Cliente se Desconecto: ${socket.id}`)
      })
    })
  }

  //*#####################################
  //* ####### manejo de conversacion 
  //*####################################

  //w Recepcion de chat 
  //? espera mensaje y datos del socket (token, nombre, etc)
  //? retorna en modo broadcast la misma data para que sea renderizada a todos los clientes (ver como enviarlo solo a una sala en particular)
  @SubscribeMessage('send-message')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ){
    const {name, token} = client.handshake.auth;
    console.log(name, message);
    if(!message) return;

    //? si hay mensaje, responde a todos con la data >
    //? aqui hay que buscar y enviar el id del usuario real en postgres 
    this.server.emit('on-message', {
      userId: client.id,
      message: message,
      name: name,
    })
  }

}
