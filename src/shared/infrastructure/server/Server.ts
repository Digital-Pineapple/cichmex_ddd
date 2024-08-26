import express, { Router } from 'express';
import { config } from '../../../../config';
import swaggerCarWash from '../../../../swagger_output.json';
import { createServer, Server as HttpServer } from 'http';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';

export class Server {
    private readonly express: express.Application;
    private readonly httpServer: HttpServer;
    // private swaggerUiOptions = {
    //     explorer: true,
    // };

    constructor(private router: Router) {
        this.express = express();
        this.httpServer = createServer(this.express);

        // // Habilitar CORS
        // this.express.use(cors({
        //     origin: 'http://localhost:3003', // Puedes cambiarlo a los orígenes que necesites
        //     methods: ['GET', 'POST', 'PUT', 'DELETE'],
        // }));

        // // Documentación Swagger
        // this.express.use(
        //     "/api-docs",
        //     swaggerUi.serve,
        //     swaggerUi.setup(swaggerCarWash, this.swaggerUiOptions)
        // );

        // Registro de rutas
        this.express.use(this.router);

        // Otras configuraciones de sockets o middlewares irán después...
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