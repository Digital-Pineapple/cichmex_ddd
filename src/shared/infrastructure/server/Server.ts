import express, { Router } from 'express';
import { config } from '../../../../config';
import swaggerCarWash from '../../../../swagger_output.json';
import { Server as ServerSocket, Socket } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import swaggerUi from 'swagger-ui-express';

export class Server {
    private readonly express: express.Application;
    private readonly httpServer: HttpServer;
    public readonly io: ServerSocket;

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
        return await new Promise((resolve, reject) => {
            this.httpServer.listen(config.PORT, () => {
                console.log(`🚀 Application ${config.APP_NAME} running on PORT ${config.PORT}`);
                resolve();
            }).on('error', (err) => {
                reject(err);
            });
        });
    }

    public resolve = async () => {
        this.io.on('connection', (socket: Socket) => {
            console.log('Client connected:', socket.id);
        });
    }
}
