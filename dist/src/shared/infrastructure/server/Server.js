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
const socketController_1 = require("../../../api/infrastructure/controllers/sockets/socketController");
class Server {
    constructor(router) {
        this.router = router;
        this.swaggerUiOptions = {
            explorer: true,
        };
        this.startServer = () => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.httpServer.listen(config_1.config.PORT, () => {
                    console.log(`🚀 Application ${config_1.config.APP_NAME} running on PORT ${config_1.config.PORT}`);
                    resolve();
                }).on('error', (err) => {
                    reject(err);
                });
            });
        });
        this.express = (0, express_1.default)();
        this.httpServer = (0, http_1.createServer)(this.express);
        this.express.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default, this.swaggerUiOptions));
        this.express.use(this.router);
        this.io = new socket_io_1.Server(this.httpServer, {
            path: '/socket/',
            cors: {
                origin: process.env.SOCKET_URL_CORS,
                methods: ["GET", "POST"]
            },
        });
        this.sockets();
    }
    sockets() {
        this.io.on('connection', (socket) => {
            socketController_1.SocketController.handleConnection(socket);
        });
        this.io.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });
    }
}
exports.Server = Server;
