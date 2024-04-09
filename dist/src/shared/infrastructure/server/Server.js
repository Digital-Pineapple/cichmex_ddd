"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const config_1 = require("../../../../config");
const swagger_output_json_1 = __importDefault(require("../../../../swagger_output.json"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
class Server {
    constructor(router) {
        this.router = router;
        this.swaggerUiOptions = {
            explorer: true,
        };
        this.startServer = () => __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve) => {
                this.httpServer.listen(config_1.config.PORT, () => {
                    console.log(`🚀 Application ${config_1.config.APP_NAME} running on PORT ${config_1.config.PORT}`);
                    resolve();
                });
            });
        });
        this.resolve = () => __awaiter(this, void 0, void 0, function* () {
            this.io.on('connection', (socket) => {
                console.log('Client connected:', socket.id);
                socket.on('notificationAction', () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        // Guardar la notificación en la base de datos
                        const notification = new Notification({ message: '¡Nueva notificación!' });
                        yield notification.save();
                        // Enviar la notificación a todos los clientes conectados
                        io.emit('notification', notification);
                        console.log('Notification sent:', notification);
                    }
                    catch (error) {
                        console.error('Error sending notification:', error);
                    }
                }));
                socket.on('disconnect', () => {
                    console.log('Client disconnected:', socket.id);
                });
            });
        });
        this.express = (0, express_1.default)();
        this.httpServer = (0, http_1.createServer)(this.express);
        this.io = new socket_io_1.Server(this.httpServer, {
            cors: {
                origin: 'https://localhost:3000'
            }
        });
        this.express.use("/api-docs", this.router, swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default, this.swaggerUiOptions));
        this.express.use(this.router);
    }
}
exports.Server = Server;
