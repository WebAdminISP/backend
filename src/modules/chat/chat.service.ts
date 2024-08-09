import { Injectable } from '@nestjs/common';

//? interfaz para cada cliente
interface Client {
    id: string;
    name: string;
}

//? Record > es un generic que permite crear esta organizacion > 
/*
{
    'ABC': { id:'ABC', name: 'Juan Perez'},
    'ABC': { id:'ABC', name: 'Juan Perez'},
}
*/


@Injectable()
export class ChatService {
    //? in memory storage the clientes conectados
    private clients: Record<string, Client> = {};

    onClientConnected(client:Client) {
        this.clients[ client.id] = client;
    }

    onClientDisconnected(id: string) {
        delete this.clients[id];
    }

    //? retorna todos los clientes conectados
    getClients() {
        return Object.values(this.clients);
    }
}
