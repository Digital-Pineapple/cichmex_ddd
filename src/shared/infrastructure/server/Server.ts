import express, { Router } from 'express';
import { config } from '../../../../config';
import swaggerCarWash from '../../../../swagger_output.json';
import { Server as ServerSocket, Socket } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import swaggerUi from 'swagger-ui-express';
import { SocketController } from '../../../api/infrastructure/controllers/sockets/socketController';

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
            swaggerUi.serve,
            swaggerUi.setup(swaggerCarWash, this.swaggerUiOptions)
        );
        this.express.use(this.router);

        this.io = new ServerSocket(this.httpServer, {
            path: '/socket/',
            cors: {
                origin: process.env.SOCKET_URL_CORS,
                methods: ["GET", "POST"]
            },
        });

        this.sockets();
    }

    private sockets() {
        this.io.on('connection', (socket: Socket) => {
            SocketController.handleConnection(socket);
        });

        this.io.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });
    }

    public startServer = async (): Promise<void> => {
        return new Promise((resolve, reject) => {
            this.httpServer.listen(config.PORT, () => {
                console.log(`🚀 Application ${config.APP_NAME} running on PORT ${config.PORT}`);
                resolve();
            }).on('error', (err) => {
                reject(err);
            });
        });
    }
}
