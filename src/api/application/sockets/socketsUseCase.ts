import { Socket } from 'socket.io';

export class Sockets {
    constructor(private socket: Socket) {}

    public handleMessage(data: any): void {
        console.log(`Message received: ${data}`);
        // Lógica adicional para manejar el mensaje
    }

    public handleDisconnect(): void {
        console.log('Client disconnected');
        // Lógica adicional para manejar la desconexión
    }
}