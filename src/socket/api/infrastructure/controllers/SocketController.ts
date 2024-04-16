
const { Socket } = require('socket.io');
import { comprobarJWT } from "../../../shared/infrastructure/validations/SocketValidations";

export const socketController = async (socket = new Socket(), io: any): Promise<void> => {
    console.log(socket);
    
    try {
        const usuario = await comprobarJWT(socket.handshake.headers['authorization']);
        if (!usuario) {
            throw new Error('Token de autenticación inválido');
        }
console.log(usuario);

        // Aquí puedes manejar otros eventos o lógica relacionada con el socket

    } catch (error) {
        console.error('Error en socketController:', error);
        // Si hay un error, podrías enviar un mensaje al cliente antes de desconectarlo
        socket.emit('error', { message: error });
        socket.disconnect();
    }
};
