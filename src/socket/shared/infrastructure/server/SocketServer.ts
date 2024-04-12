import { createServer, Server as HttpServer } from 'http';
import express, { Router, Application } from 'express';
import { Server } from 'socket.io';
import { socketController } from '../../../api/infrastructure/controllers/SocketController';

export class SocketServer {

    private readonly express    : Application;
    private readonly io     : Server;
    private readonly httpServer : HttpServer;

    constructor(private router : Router) {
        this.express          = express()
        this.httpServer       = createServer(this.express);
        this.io           = new Server(this.httpServer,{
            cors:{
                origin: 'https://localhost:4000'
            }
        });
        this.express.use(this.router);
        this.sockets()
    }

    public startSocketServer = async (): Promise<void> => {
        return await new Promise((resolve) => {
            this.httpServer.listen(process.env.SOCKET_PORT, () => {
                console.log(`🚀 Socket Service running on PORT ${process.env.SOCKET_PORT}`);
            });
        })
    }
    private sockets(): void {
        this.io.on('connection', (socket: any) => {
            console.log('Socket connected:', socket.id);
            socketController(socket, this.io);
            
            socket.on('disconnect', () => {
                console.log('Socket disconnected:', socket.id);
                // Aquí puedes manejar la desconexión del socket si es necesario
            });
        });
    }

}