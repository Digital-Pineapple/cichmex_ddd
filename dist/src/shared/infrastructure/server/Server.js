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
const http_1 = require("http");
class Server {
    // private swaggerUiOptions = {
    //     explorer: true,
    // };
    constructor(router) {
        this.router = router;
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
}
exports.Server = Server;
