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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const ErrorHandler_1 = require("../../../../shared/domain/ErrorHandler");
const ResponseData_1 = require("../../../../shared/infrastructure/validation/ResponseData");
const Utils_1 = require("../../../../shared/infrastructure/validation/Utils");
class AuthController extends ResponseData_1.ResponseData {
    constructor(authUseCase, typeUserUseCase, s3Service, twilioService) {
        super();
        this.authUseCase = authUseCase;
        this.typeUserUseCase = typeUserUseCase;
        this.s3Service = s3Service;
        this.twilioService = twilioService;
        this.path = '/users';
        this.login = this.login.bind(this);
        this.loginAdmin = this.loginAdmin.bind(this);
        this.register = this.register.bind(this);
        this.registerAdmin = this.registerAdmin.bind(this);
        this.loginWithGoogle = this.loginWithGoogle.bind(this);
        this.registerByGoogle = this.registerByGoogle.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.uploadProfilePhoto = this.uploadProfilePhoto.bind(this);
        this.revalidateToken = this.revalidateToken.bind(this);
        this.verifyCode = this.verifyCode.bind(this);
        this.savePhone = this.savePhone.bind(this);
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const response = yield this.authUseCase.signIn(email, password);
                if (!(response instanceof ErrorHandler_1.ErrorHandler) && response.user.profile_image === undefined) {
                    response.user.profile_image ?
                        response.user.profile_image = yield this.s3Service.getUrlObject(response.user.profile_image) :
                        'No hay imagen de perfil';
                }
                console.log(response, 'authController');
                this.invoke(response, 200, res, '', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al iniciar sesión', 500));
            }
        });
    }
    loginAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const response = yield this.authUseCase.signIn(email, password);
                // if (!(response instanceof ErrorHandler) && response.user.profile_image === undefined) {
                //     response.user.profile_image ?
                //         response.user.profile_image = await this.s3Service.getUrlObject(response.user.profile_image) :
                //         'No hay imagen de perfil'
                // }
                this.invoke(response, 200, res, '', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al iniciar sesión', 500));
            }
        });
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, fullname, phone } = req.body;
            try {
                const responsedefault = yield this.typeUserUseCase.getTypeUsers();
                const def = responsedefault === null || responsedefault === void 0 ? void 0 : responsedefault.filter(item => item.name === 'Customer');
                const TypeUser_id = def === null || def === void 0 ? void 0 : def.map(item => item._id);
                const response = yield this.authUseCase.signUp({ fullname, email, password, phone, type_user: TypeUser_id });
                this.invoke(response, 200, res, '', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler(`Error:${error}`, 500));
            }
        });
    }
    registerAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, fullname, phone } = req.body;
            try {
                const responsedefault = yield this.typeUserUseCase.getTypeUsers();
                const def = responsedefault === null || responsedefault === void 0 ? void 0 : responsedefault.filter(item => item.name === 'Admin');
                const TypeUser_id = def === null || def === void 0 ? void 0 : def.map(item => item._id);
                const response = yield this.authUseCase.signUp({ fullname, email, password, phone, type_user: TypeUser_id });
                this.invoke(response, 200, res, '', next);
            }
            catch (error) {
                console.log(error);
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al iniciar sesión', 500));
            }
        });
    }
    loginWithGoogle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idToken } = req.body;
            try {
                const response = yield this.authUseCase.signInWithGoogle(idToken);
                this.invoke(response, 200, res, '', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler('Usuario no registrado', 500));
            }
        });
    }
    registerByGoogle(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idToken } = req.body;
            try {
                const response = yield this.authUseCase.signUpWithGoogle(idToken);
                if (!(response instanceof ErrorHandler_1.ErrorHandler)) {
                    const responsedefault = yield this.typeUserUseCase.getTypeUsers();
                    const def = responsedefault === null || responsedefault === void 0 ? void 0 : responsedefault.filter(item => item.name === 'Customer');
                    const TypeUser_id = def === null || def === void 0 ? void 0 : def.map(item => item._id);
                    // const code = generateRandomCode();
                    const resp = yield this.authUseCase.signUp2({ email: response === null || response === void 0 ? void 0 : response.email, fullname: response === null || response === void 0 ? void 0 : response.fullname, type_user: TypeUser_id, google: true, profile_image: response === null || response === void 0 ? void 0 : response.picture });
                    // const resp = await this.authUseCase.signUpPlatform({ email: response?.email, fullname: response?.fullname, accountVerify: code, type_user: TypeUser_id, google: true });
                    this.invoke(resp, 200, res, '', next);
                }
                else {
                    this.invoke(response, 200, res, '', next);
                }
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al registrar', 500));
            }
        });
    }
    changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, new_password } = req.body;
            const { user } = req;
            try {
                const response = yield this.authUseCase.changePassword(password, new_password, user);
                this.invoke(response, 200, res, 'La contraseña se cambio con exito', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al cambiar la contraseña', 500));
            }
        });
    }
    uploadProfilePhoto(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const pathObject = `${this.path}/${id}/${(_a = req.file) === null || _a === void 0 ? void 0 : _a.fieldname}`;
                const { url, success, message } = yield this.s3Service.uploadToS3AndGetUrl(pathObject + '.jpg', req.file, 'image/jpeg');
                if (!success)
                    return new ErrorHandler_1.ErrorHandler('Hubo un error al subir la imagen', 400);
                const response = yield this.authUseCase.updateProfilePhoto(pathObject, id);
                response.profile_image = url;
                this.invoke(response, 200, res, message, next);
            }
            catch (error) {
                console.log(error);
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al subir la foto', 500));
            }
        });
    }
    // public async updateCustomer(req: Request, res: Response, next: NextFunction) {
    //     const { user } = req;
    //     const { email, fullname } = req.body;
    //     try {
    //         const response = await this.authUseCase.updateCustomer(user._id, email, fullname);
    //         response.profile_image = await this.s3Service.getUrlObject(response?.profile_image);
    //         this.invoke(response, 200, res, 'El usuario se actualizo con exito', next);
    //     } catch (error) {
    //         next(new ErrorHandler('Hubo un error al actualizar la información', 500));
    //     }
    // }
    revalidateToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            try {
                const find = yield this.authUseCase.findUser(user.email);
                const response = yield this.authUseCase.generateToken(user);
                this.invoke(response, 200, res, '', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al generar el token', 500));
            }
        });
    }
    savePhone(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { phone_number, prefix } = req.body;
            try {
                const code = (0, Utils_1.generateRandomCode)();
                const vcode = parseInt(code);
                // await this.twilioService.sendSMS(`Codigo de verificacion CarWash autolavado y más- ${code}`);
                const response = yield this.authUseCase.findPhone(phone_number);
                this.invoke(response, 200, res, 'El telefono se registro correctamente', next);
            }
            catch (error) {
                console.log(error);
                next(new ErrorHandler_1.ErrorHandler('Hubo un error al guardar el telefono', 500));
            }
        });
    }
    verifyCode(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = req;
            const { code } = req.body;
            try {
                const response = yield this.authUseCase.verifyPhoneNumber(user._id, +code);
                this.invoke(response, 200, res, 'El código de verificación se envió correctamente', next);
            }
            catch (error) {
                next(new ErrorHandler_1.ErrorHandler('El codigo no se ha enviado', 500));
            }
        });
    }
}
exports.AuthController = AuthController;
