import { createServer, Server as HttpServer } from 'http';
import express, { Router, Application } from 'express';
import { Server, Socket } from 'socket.io';
import {socketController} from '../../../api/infrastructure/controllers/SocketController';
import { Sockets } from '../../../api/application/Actions/Sockets';
import { connect } from 'mongoose';
const cors = require('cors');

export class SocketServer {
    private readonly app: Application;
    private readonly io: Server;
    private readonly port: number;
    private readonly server: HttpServer;

    constructor(private router: Router) {
        this.app = express();
        this.port = Number(process.env.SOCKET_PORT);
        this.server = createServer(this.app);
        this.io = new Server(this.server, {
            cors: {
                origin: "https://localhost:4000",
                methods: ["GET", "POST"]
            }
        });
        this.setupMiddlewares();
        // this.setupSocketHandlers();
        this.sockets()
    }

    private setupMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(this.router);
        this.app.use(cors({
            origin: "https://localhost:4000"
        }));
    }

   

    sockets() {
        this.io.on('connection', ( socket ) => socketController(socket)
         )
    }

    public startSocketServer(): void {
        this.server.listen(this.port, () => {
            console.log(`🚀 Socket Service running on PORT ${this.port}`);
        });
    }
}
