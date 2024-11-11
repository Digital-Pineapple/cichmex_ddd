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
exports.Authentication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const axios_1 = __importDefault(require("axios"));
const generate_password_1 = __importDefault(require("generate-password"));
const google_auth_library_1 = require("google-auth-library");
const qs_1 = __importDefault(require("qs"));
class Authentication {
    constructor() {
        this.googleKey = process.env.GOOGLE_CLIENT_ID;
        this.client = new google_auth_library_1.OAuth2Client(this.googleKey);
        this.tiktokKey = process.env.TIKTOK_CLIENT_ID;
        this.tiktokSecret = process.env.TIKTOK_CLIENT_SECRET;
        this.redirectUri = process.env.REDIRECT_URI_LOGIN;
        this.redirectUriRegister = process.env.REDIRECT_URI_REGISTER;
        this.isSignIn = true;
    }
    isSignUp() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isSignIn = false;
        });
    }
    getUrlTikTok(csrfState) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = 'https://www.tiktok.com/v2/auth/authorize/';
            url += `?client_key=${this.tiktokKey}`;
            url += '&scope=user.info.basic';
            url += '&response_type=code';
            url += `&redirect_uri=${this.redirectUri}`;
            url += '&state=' + csrfState;
            return url;
        });
    }
    validateTikTokAccessToken(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = 'https://open.tiktokapis.com/v2/oauth/token/';
            const data = {
                grant_type: 'authorization_code',
                code: code,
                client_key: this.tiktokKey,
                client_secret: this.tiktokSecret,
                redirect_uri: this.redirectUri
            };
            try {
                const response = yield axios_1.default.post(url, qs_1.default.stringify(data), {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                });
                return response.data; // Devuelve solo los datos necesarios
            }
            catch (error) {
                console.error('Error al validar el token de acceso de TikTok:', error);
                throw new Error('Error al validar el token de acceso de TikTok'); // O maneja el error de otra forma
            }
        });
    }
    getUserInfoTikTok(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = "https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name";
                const { data } = yield axios_1.default.get(url, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const user = data.data.user;
                return user;
            }
            catch (error) {
                throw new Error('Error al obtener la información del usuario de TikTok');
            }
        });
    }
    generateJWT(user, uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const payload = { uuid };
                jsonwebtoken_1.default.sign(payload, process.env.SECRET_JWT_KEY || '', {
                    expiresIn: '24h',
                }, (error, token) => {
                    if (error)
                        return reject('Error to generate JWT');
                    resolve({ token, user });
                });
            });
        });
    }
    generateJWTRP(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const payload = { data };
                jsonwebtoken_1.default.sign(payload, process.env.SECRET_JWT_KEY || '', {
                    expiresIn: '24h',
                }, (error, token) => {
                    if (error)
                        return reject('Error to generate JWT');
                    resolve({ token });
                });
            });
        });
    }
    validateGoogleToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const ticket = yield this.client.verifyIdToken({
                    idToken: token,
                    audience: this.googleKey,
                });
                if (!ticket)
                    reject('El token de google no es valido');
                const payload = ticket.getPayload();
                resolve({ fullname: payload === null || payload === void 0 ? void 0 : payload.name, email: payload === null || payload === void 0 ? void 0 : payload.email, picture: payload === null || payload === void 0 ? void 0 : payload.picture, });
            }));
        });
    }
    validateFacebookToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture,last_name`;
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield axios_1.default.get(url);
                    const userData = response.data;
                    resolve(userData);
                }
                catch (error) {
                    reject("Error al validar el token de facebook");
                }
            }));
        });
    }
    encryptPassword(password) {
        const salt = bcrypt_1.default.genSaltSync();
        return bcrypt_1.default.hashSync(password, salt);
    }
    decryptPassword(password, encryptedPassword) {
        return bcrypt_1.default.compareSync(password, encryptedPassword);
    }
    generateRandomPassword() {
        return generate_password_1.default.generate({
            length: 16,
            numbers: true,
            symbols: true,
            strict: true,
        });
    }
    validateToken() {
        return generate_password_1.default.generate({
            length: 16,
            numbers: true,
            symbols: true,
            strict: true,
        });
    }
}
exports.Authentication = Authentication;
