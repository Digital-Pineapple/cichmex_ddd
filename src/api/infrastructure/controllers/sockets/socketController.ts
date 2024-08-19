import { Socket } from 'socket.io';

export class SocketController {
    public static handleConnection(socket: Socket): void {
        console.log('Usuario conectado:', socket.id);

        socket.on('disconnect', (reason) => {
            console.log('User disconnected:', socket.id, 'Reason:', reason);
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        // Maneja eventos específicos aquí
        socket.on('some_event', (data) => {
            console.log('Received some_event:', data);
            // Agrega lógica para manejar el evento
        });
    }
}
