// src/infrastructure/config/socket.js
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
let ioInstance: Server | null = null;

export const initSocket = (server: HttpServer) => {
  ioInstance = new Server(server,  {
      cors: {
        origin: "http://localhost:3003",
        methods: ["GET", "POST"]
      }
  });
  ioInstance.on("connection", (socket) => {    
    console.log("root socket user connected");        
  });
  // Configurar namespaces (un nuevo canal de comunicación pues)
  const myNamespace = ioInstance.of('/admin');
  myNamespace.on('connection', (socket) => {
    // console.log('Cliente conectado al admin');
    socket.on("message", (data)=>{      
        console.log("fromm my namespace i say " + data);   
        socket.emit("received_message", `hello from socket io ${Date()}`)
    });
    socket.on('disconnect', () => {
    //   console.log('Cliente desconectado');
    });
  });

  return ioInstance;
};

export const getSocketInstance = () => {
  if (!ioInstance) {
    throw new Error('Socket.IO no ha sido inicializado');
  }
  return ioInstance;
};