"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = require("dotenv");
const { NODE_ENV } = process.env;
// Cargar el archivo de entorno adecuado según NODE_ENV
if (NODE_ENV === 'production') {
    (0, dotenv_1.config)({ path: '.env.production' });
}
else if (process.env.NODE_ENV === 'test') {
    (0, dotenv_1.config)({ path: '.env.test' });
}
else {
    (0, dotenv_1.config)(); // Carga `.env` por defecto (para desarrollo)
}
// config();
const test_1 = __importDefault(require("./environments/test"));
const development_1 = __importDefault(require("./environments/development"));
const production_1 = __importDefault(require("./environments/production"));
let currentConfig = test_1.default;
exports.config = currentConfig;
switch (NODE_ENV) {
    case 'production':
        exports.config = currentConfig = production_1.default;
        break;
    case 'test':
        exports.config = currentConfig = test_1.default;
        break;
    default:
        exports.config = currentConfig = development_1.default;
}
