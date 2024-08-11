import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ChatService {
  // 'rooms' es un dicccionario > esto se haria en base de datos en realidad
  //la key es el roomId y su valor un objeto con ids the user y admin
  /*
 {
  'room1': {
    user: 'user123',
    admin: 'admin456'
  },
  'room2': {
    user: 'user789',
    admin: 'admin012'
  },
   */
  private rooms: Record<string, { user: string; admin: string }> = {};

  // crea un chatRoom solicitado por cliente y lo asocia al el
  async createRoom(userId: string): Promise<string> {
    //genera id unico para el chatRoom
    const roomId = this.generateRoomId();
    // crea nuevo registro del room en el diccionario
    this.rooms[roomId] = { user: userId, admin: null };
    console.log(`#### >> Room Created with ID: ${roomId}in dictionary`)
    console.log(`#### >> User was Added to the room dictionary ${userId}`)
    return roomId;
  }

  // agrega usuario al diccionario/db/room
  async joinRoom(roomId: string, userId: string, isAdmin: boolean): Promise<boolean> {
    // verifica si room existe
    console.log('Existing Rooms:', this.rooms);
    if (!this.rooms[roomId]) {
      console.log('ROOM  DOES NOT EXIST MATE')
      return false;
    } 
    
    // si usuario es admin y NO esta aun agregado al room, se lo agrega
    //si usuario no es admin, se verifica si ya esta asignado a este room (en cuyo caso retorna true) > evita que otros usuarios non-admins puedan entrar
    if (isAdmin && !this.rooms[roomId].admin) {
      //solo puede haber un admin por room
      this.rooms[roomId].admin = userId;
      console.log('USER ADDED TO ROOM DICTIONARY')
      console.log('Existing Rooms:', this.rooms);
      return true;
    } else if (!isAdmin && this.rooms[roomId].user === userId) {
      console.log('USER IS ALREADY ASSIGNED TO THIS ROOM, OK')
      console.log('Existing Rooms:', this.rooms);
      return true;
    }
    
    return false;
  }

  // retorna lista de participantes del room indicado
 async  getRoomParticipants(roomId: string): Promise<{ user: string; admin: string } | null> {
    return this.rooms[roomId] || null;
  }

  // genera id unico para room
  private generateRoomId(): string {
    return uuidv4();
  }
}