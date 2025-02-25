import express, { Router } from 'express';
import { config } from '../../../../config';
import swaggerCarWash from '../../../../swagger_output.json';
import { createServer, Server as HttpServer } from 'http';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from "swagger-jsdoc";
// import { Server as ServerIO } from "socket.io";

import cors from 'cors';
import { options } from '../../../../swagger_options';
import { SocketService } from '../socket/sockeService';
import { initSocket } from '../socket/socketIOService';

export class Server {
    private readonly express: express.Application;
    private readonly httpServer: HttpServer;
    // private readonly socketService: SocketService;    
    private swaggerUiOptions = {
        explorer: true,        
    };    
    private readonly specs = swaggerJsDoc(options);

    constructor(private router: Router) {
        this.express = express();
        this.httpServer = createServer(this.express);  
        // this.socketService = new SocketService(this.httpServer);      
        // this.serverIO = new ServerIO(this.httpServer, {
        //   cors: {
        //     origin: "http://localhost:3003",
        //     methods: ["GET", "POST"]
        //   }
        // });

        // // Habilitar CORS
        // this.express.use(cors({
        //     origin: 'http://localhost:3003', // Puedes cambiarlo a los orígenes que necesites
        //     methods: ['GET', 'POST', 'PUT', 'DELETE'],
        // }));

        // // Documentación Swagger
        this.express.use(
            "/api-docs",
            swaggerUi.serve,
            swaggerUi.setup(this.specs, this.swaggerUiOptions)
        );        

        // Registro de rutas
        this.express.use(this.router);

        // Otras configuraciones de sockets o middlewares irán después...
    }

    public startServer = async (): Promise<void> => { 
        return new Promise((resolve, reject) => {
            initSocket(this.httpServer);
            // new SocketService(this.httpServer);
            // this.socketService
            // this.serverIO.on("connection", (socket) => {
            //     socket.on("message", (data) => {
            //         console.log("socket says: " + data);                    
            //     })                
            //     resolve();             
            // });
            this.httpServer.listen(config.PORT, () => {
                console.log(`🚀 Application ${config.APP_NAME} running on PORT ${config.PORT}`);
                console.log(`📃 Documentation available at http://localhost:${config.PORT}/api-docs`);                
                resolve();
            }).on('error', (err) => {
                reject(err);
            });
        });
    }
}