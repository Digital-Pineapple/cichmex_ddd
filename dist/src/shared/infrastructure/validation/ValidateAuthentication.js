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
exports.checkTypeUserAuth = exports.validateTokenRestorePassword = exports.validateAuthentication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../../../config");
const ErrorHandler_1 = require("../../domain/ErrorHandler");
const UserModel_1 = __importDefault(require("../../../api/infrastructure/models/UserModel"));
const verifyToken_1 = require("../helpers/verifyToken");
const validateAuthentication = (req, res, next) => {
    const token = req.header('token');
    if (!token)
        return next(new ErrorHandler_1.ErrorHandler('Token is required', 401));
    try {
        const { user } = jsonwebtoken_1.default.verify(token, config_1.config.SECRET_JWT_KEY);
        if (!user)
            return next(new ErrorHandler_1.ErrorHandler('El usuario no es valido', 400));
        req.user = user;
        next();
    }
    catch (error) {
        next(new ErrorHandler_1.ErrorHandler('Token no valido', 400));
    }
};
exports.validateAuthentication = validateAuthentication;
const validateTokenRestorePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ').pop();
    if (!token)
        return next(new ErrorHandler_1.ErrorHandler('Token is required', 401));
    try {
        const { data } = jsonwebtoken_1.default.verify(token, config_1.config.SECRET_JWT_KEY);
        console.log(data, 'verify');
        const userData = yield UserModel_1.default.findById(data);
        if (!userData) {
            throw new ErrorHandler_1.ErrorHandler('Usuario no encontrado', 404);
        }
        req.user = data;
        next();
    }
    catch (error) {
        next(new ErrorHandler_1.ErrorHandler('Token no valido', 400));
    }
});
exports.validateTokenRestorePassword = validateTokenRestorePassword;
const checkTypeUserAuth = (type_user) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    try {
        const token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ').pop();
        if (!token) {
            throw new ErrorHandler_1.ErrorHandler('Token es requerido', 401);
        }
        const tokenData = yield (0, verifyToken_1.verifyToken)(token);
        const userData = yield UserModel_1.default.findById(tokenData.user._id);
        if (!userData) {
            throw new ErrorHandler_1.ErrorHandler('Usuario no encontrado', 404);
        }
        const userTypes = Array.isArray(type_user) ? type_user : [type_user];
        // Convertir userData.type_user a ObjectId si es un string
        const userTypeString = ((_c = userData.type_user) === null || _c === void 0 ? void 0 : _c._id) ? (_d = userData.type_user._id) === null || _d === void 0 ? void 0 : _d.toString() : '';
        if (!userTypes.includes(userTypeString)) {
            throw new ErrorHandler_1.ErrorHandler('No tiene permisos necesarios', 403);
        }
        next();
    }
    catch (error) {
        next(error); // Pasar el error original para una mejor depuración
    }
});
exports.checkTypeUserAuth = checkTypeUserAuth;
exports.default = exports.validateAuthentication;
