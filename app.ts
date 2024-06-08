import { Configuration } from './config';
import { Container } from './src/shared/infrastructure/Container';

import { SocketContainer } from "./src/socket/shared/infrastructure/SocketContainer";

import { SocketServer } from "./src/socket/shared/infrastructure/server/SocketServer";


import { Server } from './src/shared/infrastructure/server/Server';

const container = new Container();
const socketContainer = new SocketContainer();

const server = container.invoke().resolve<Server>('server');
const config = container.invoke().resolve<Configuration>('config');
const serverSocket = socketContainer.invoke().resolve<SocketServer>('socketServer');

server
    .startServer()
    .then(async () => {
        
        await container.invoke().resolve('db')
        console.log(`Env: ${config.NODE_ENV}`);

    }).catch((err)=>{
        console.error('Error starting server:', err);
    });
 