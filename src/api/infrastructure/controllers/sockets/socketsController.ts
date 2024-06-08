import { Socket } from 'socket.io';

export default (socket: Socket) => {
    socket.on('message', (msg) => {
        console.log('Message received:', msg);
        socket.broadcast.emit('message', msg); // O manejarlo como prefieras
    });

    // Otros eventos personalizados
};
