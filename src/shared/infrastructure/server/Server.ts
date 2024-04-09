import express, { Router } from 'express';
import { config } from '../../../../config';
import swaggerCarWash from '../../../../swagger_output.json';
import { Server as ServerSocket, Socket } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import swaggerUi from 'swagger-ui-express';

export class Server {
    private readonly express: express.Application;
    private readonly httpServer: HttpServer;
    public readonly io: ServerSocket; // Cambiado a public

    private swaggerUiOptions = {
        explorer: true,
    };

    constructor(private router: Router) {
        this.express = express();
        this.httpServer = createServer(this.express);
        this.io = new ServerSocket(this.httpServer, {
            cors: {
                origin: 'https://localhost:3000'
            }
        });
        this.express.use(
            "/api-docs",
            this.router,
            swaggerUi.serve,
            swaggerUi.setup(swaggerCarWash, this.swaggerUiOptions)
        );
        this.express.use(this.router);
    }

    public startServer = async (): Promise<void> => {
        return await new Promise((resolve) => {
            this.httpServer.listen(config.PORT, () => {
                console.log(`🚀 Application ${config.APP_NAME} running on PORT ${config.PORT}`);
                resolve();
            })
        });
    }

    public resolve = async () => {
        this.io.on('connection', (socket:Socket) => { // Usar this.io en lugar de this.socket
            console.log('Client connected:', socket.id);
            socket.on('notificationAction', async () => {
                try {
                    // Guardar la notificación en la base de datos
                    const notification = new Notification({ message: '¡Nueva notificación!' });
                    await notification.save();
        
                    // Enviar la notificación a todos los clientes conectados
                    io.emit('notification', notification);
        
                    console.log('Notification sent:', notification);
                } catch (error) {
                    console.error('Error sending notification:', error);
                }
            });
            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });
    }
}
