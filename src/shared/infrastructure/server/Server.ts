import express, { Router } from 'express';
import { config } from '../../../../config';
import swaggerCarWash from '../../../../swagger_output.json';
import { Server as ServerSocket, Socket } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import swaggerUi from 'swagger-ui-express';
import socketController from '../../../api/infrastructure/controllers/sockets/socketsController';


export class Server {
    private readonly express: express.Application;
    private readonly httpServer: HttpServer;
    private readonly io: ServerSocket;
    private swaggerUiOptions = {
        explorer: true,
    };

    constructor(private router: Router) {
        this.express = express();
        this.httpServer = createServer(this.express);
        this.express.use(
            "/api-docs",
            this.router,
            swaggerUi.serve,
            swaggerUi.setup(swaggerCarWash, this.swaggerUiOptions)
        );
        this.express.use(this.router);
        this.io = new ServerSocket(this.httpServer, {
            path: '/socket/',
            cors: {
                origin: "https://localhost:4000",
                methods: ["GET", "POST"]
            },
        });
        this.sockets();
    }

    private sockets() {
        this.io.on('connection', (socket) => {
            console.log('A user connected:', socket.id);

            socket.on('disconnect', (reason) => {
                console.log('User disconnected:', socket.id, 'Reason:', reason);
            });

            socket.on('error', (error) => {
                console.error('Socket error:', error);
            });
            this.io.on('connect_error', (error) => {
                console.error('Connection error:', error);
            });
            
            // Aquí puedes llamar a tu socketController para manejar eventos específicos
            socketController(socket);
        });

        this.io.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });
    }

    public startServer = async (): Promise<void> => {
        return await new Promise((resolve, reject) => {
            this.httpServer.listen(config.PORT, () => {
                console.log(`🚀 Application ${config.APP_NAME} running on PORT ${config.PORT}`);
                resolve();
            }).on('error', (err) => {
                reject(err);
            });
        });
    }
}
