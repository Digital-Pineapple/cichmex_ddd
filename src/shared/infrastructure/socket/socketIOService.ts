// src/infrastructure/config/socket.js
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { config } from '../../../../config';
// let ioInstance: Server | null = null;

class socketIOService {
  private io: Server | null = null;
  private adminNamespace: any = null; // Referencia al namespace '/admin'
  init(server: HttpServer){
    this.io =  new Server(server, {
      cors: {
        origin: config.SOCKET_CLIENT_ADMIN,
        methods: ["GET", "POST"]
      }
    });  
    this.io.on("connection", (socket) => {
      socket.on("disconnect", () => {      
      });
   });
     this.adminNamespace = this.io.of('/admin');
      this.adminNamespace.on('connection', (socket: any) => {
      // console.log('Cliente conectado al admin');
      socket.on("message", (data: any)=>{      
          console.log("from my namespace i say " + data);   
          socket.emit("received_notification", `hello from socket io ${Date()}`)
      });
      socket.on('disconnect', () => {
      //   console.log('Cliente desconectado');
      });
    });
  }
  getIO(): Server {
    if (!this.io) {
      throw new Error("❌ Socket.IO no ha sido inicializado.");
    }
    return this.io;
  }
    // ✅ Emitir eventos a todos en el namespace '/admin'
    emitToAdminChannel(event: string, data: any) {
      if (this.adminNamespace) {
        this.adminNamespace.emit(event, data);
        console.log(`📢 Emitiendo evento '${event}' a /admin`);
      } else {
        console.warn("⚠️ adminNamespace no está inicializado.");
      }
    }
  // ✅ Emitir eventos a un usuario específico en '/admin'
  // emitToAdminUserChannel(userId: string, event: string, data: any) {
  //   if (this.adminNamespace) {
  //     this.adminNamespace.to(userId).emit(event, data);
  //     console.log(`📢 Emitiendo evento '${event}' a usuario ${userId} en /admin`);
  //   } else {
  //     console.warn("⚠️ adminNamespace no está inicializado.");
  //   }
  // }
}

export const socketService = new socketIOService();

