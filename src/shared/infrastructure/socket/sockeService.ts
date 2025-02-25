import { Server as SocketIOServer, Namespace, Socket } from "socket.io";
import { Server as HttpServer } from "http";

interface EventCallback {
  (socket: Socket, data: any): void;
}

export class SocketService {
  private static io: SocketIOServer;
  private static namespaces: { [key: string]: Namespace } = {};
  private static origin: string = "http://localhost:3003";

  // Inicializa Socket.IO usando el servidor HTTP
  constructor(server: HttpServer) {
    SocketService.io = new SocketIOServer(server, {
      cors: {
        origin: SocketService.origin,
        methods: ["GET", "POST"]
      }
    });
    console.log("Socket.IO inicializado.");
    
    // Opcional: registrar el namespace raíz por defecto
    SocketService.registerNamespace("/");
  }

  // Registra (o retorna si ya existe) un namespace dado
  public static registerNamespace(namespaceName: string): Namespace {
    if (!SocketService.io) {
      throw new Error("Socket.IO no ha sido inicializado.");
    }
    if (SocketService.namespaces[namespaceName]) {
      return SocketService.namespaces[namespaceName];
    }
    const nsp: Namespace = SocketService.io.of(namespaceName);
    nsp.on("connection", (socket: Socket) => {
      console.log(`Cliente conectado al namespace '${namespaceName}': ${socket.id}`);
      // Aquí puedes agregar listeners por defecto si es necesario
    });
    SocketService.namespaces[namespaceName] = nsp;
    return nsp;
  }

  // Emite un evento a todos los clientes conectados en un namespace específico
  public static emitEvent(namespaceName: string, eventName: string, payload: any): void {
    const nsp = SocketService.namespaces[namespaceName];
    if (!nsp) {
      throw new Error(`El namespace '${namespaceName}' no existe. Regístralo primero.`);
    }
    nsp.emit(eventName, payload);
  }

  // Registra un callback para recibir un evento en un namespace específico
  // Cada vez que se conecta un cliente en ese namespace se asocia el listener
  public static receiveEvent(namespaceName: string, eventName: string, callback: EventCallback): void {
    const nsp = SocketService.namespaces[namespaceName];
    if (!nsp) {
      throw new Error(`El namespace '${namespaceName}' no existe. Regístralo primero.`);
    }
    nsp.on("connection", (socket: Socket) => {
      socket.on(eventName, (data: any) => {
        callback(socket, data);
      });
    });
  }

  // Obtiene la instancia de un namespace registrado
  public static getNamespace(namespaceName: string): Namespace {
    if (!SocketService.namespaces[namespaceName]) {
      throw new Error(`El namespace '${namespaceName}' no existe.`);
    }
    return SocketService.namespaces[namespaceName];
  }
  public static getInstance(): SocketIOServer {
    if (!this.io) {
      throw new Error("Socket.IO no ha sido inicializado.");
    }
    return this.io;
  }

}



// import { Server as ServerIO } from "socket.io";
// import { Server as HttpServer } from "http";

// export class SocketService { 
//     private readonly serverIO: ServerIO;
//     private readonly origin: string = "http://localhost:3003";
//     // private  socket : string;
//     constructor(server: HttpServer){
//         this.serverIO = new ServerIO(server, {
//             cors: {
//                 origin: this.origin,
//                 methods: ["GET", "POST"]
//             }
//         });
//         this.serverIO.on("connection", (socket) => {
//             console.log("Cliente conectado 🚀:", socket.id);                             
//         });
//     }
//     public emitEvent(eventName: string, payload: any) {
//         if(!this.serverIO){
//             throw new Error("Socket io no ha sido inicializado");
//         }
//         this.serverIO.emit(eventName, payload);
//     }
//     public receiveEvent(eventName: string, callback: any){
//         if(!this.serverIO){
//             throw new Error("Socket io no ha sido inicializado");            
//         }
//         this.serverIO.on("connection", (socket: any) => {
//             socket.on(eventName, (data: any) => {
//                 callback(data)
//             })
//         })
//     }

// }