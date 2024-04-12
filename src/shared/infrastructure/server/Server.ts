import express, { Router } from 'express';
import { config } from '../../../../config';
import swaggerCarWash from '../../../../swagger_output.json';
import { Server as ServerSocket, Socket } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';
import swaggerUi from 'swagger-ui-express';

export class Server {
    private readonly express: express.Application;
    private readonly httpServer: HttpServer;

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
