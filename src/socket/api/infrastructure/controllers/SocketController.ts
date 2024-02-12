import { Socket } from 'socket.io';
import { Sockets } from '../../application/Actions/Sockets';

export const  socketController = async (socket: Socket)=>{
    const sockets = new Sockets(socket);

    // Manejar eventos de conexión
    socket.on('message', (data: any) => sockets.handleMessage(data));
    socket.on('disconnect', () => sockets.handleDisconnect());
}
