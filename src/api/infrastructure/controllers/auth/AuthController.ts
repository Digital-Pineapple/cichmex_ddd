import { NextFunction, Request, Response, response } from 'express';

import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';

import { AuthUseCase } from '../../../application/auth/AuthUseCase';
import { IAuth, IGoogleRegister, IGoogleResponse } from '../../../application/authentication/AuthenticationService';

import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { TwilioService } from '../../../../shared/infrastructure/twilio/TwilioService';

import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { generateRandomCode } from '../../../../shared/infrastructure/validation/Utils';


import { IPhoneRequest } from '../../../application/auth/interfaces';
import { TypeUserUseCase } from '../../../application/typeUser/TypeUserUseCase';
import { MPService } from '../../../../shared/infrastructure/mercadopago/MPService';


export class AuthController extends ResponseData {
    protected path = '/users';

    constructor(private readonly authUseCase: AuthUseCase,
        private readonly typeUserUseCase: TypeUserUseCase,
        private readonly s3Service: S3Service,
        private readonly twilioService: TwilioService,
        private readonly mpService : MPService
    ) {
        super();
        this.login = this.login.bind(this);
        this.loginAdmin = this.loginAdmin.bind(this);
        this.loginPartner = this.loginPartner.bind(this);
        this.register = this.register.bind(this);
        this.registerAndPay = this.registerAndPay.bind(this);
        this.registerAdmin = this.registerAdmin.bind(this);
        this.loginWithGoogle = this.loginWithGoogle.bind(this);
        this.loginWithGooglePartner = this.loginWithGooglePartner.bind(this);
        this.registerByGoogle = this.registerByGoogle.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.uploadProfilePhoto = this.uploadProfilePhoto.bind(this);
        this.revalidateToken = this.revalidateToken.bind(this);
        this.verifyCode = this.verifyCode.bind(this);
        this.savePhone = this.savePhone.bind(this);
        
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<IAuth | ErrorHandler | void> {
        const { email, password } = req.body;
  ;
        
        try {
            const response = await this.authUseCase.signIn(email, password);
        
            if (!(response instanceof ErrorHandler) && response.user.profile_image !== undefined) {
                response.user.profile_image ?
                    response.user.profile_image = await this.s3Service.getUrlObject(response.user.profile_image+".jpg") :
                    'No hay imagen de perfil'
            }

            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al iniciar sesión', 500));
        }
    }

    public async loginPartner(req: Request, res: Response, next: NextFunction): Promise<IAuth | ErrorHandler | void> {
        const { email, password } = req.body;
     
        try {
            
            const response = await this.authUseCase.signInPartner(email, password);
        
            if (!(response instanceof ErrorHandler) && response.user.profile_image !== undefined) {
                response.user.profile_image ?
                    response.user.profile_image = await this.s3Service.getUrlObject(response.user.profile_image+".jpg") :
                    'No hay imagen de perfil'
            }

            this.invoke(response, 200, res, '', next);
        } catch (error) {
            console.log(error);
            
            next(new ErrorHandler('Hubo un error al iniciar sesión', 500));
        }
    }



    public async loginAdmin(req: Request, res: Response, next: NextFunction): Promise<IAuth | ErrorHandler | void> {
        const { email, password } = req.body;
     
        try {
            const response = await this.authUseCase.signInAdmin(email, password)

            // if (!(response instanceof ErrorHandler) && response.user.profile_image === undefined) {
            //     response.user.profile_image ?
            //         response.user.profile_image = await this.s3Service.getUrlObject(response.user.profile_image) :
            //         'No hay imagen de perfil'
            // }

            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al iniciar sesión', 500));
        }
    }

    public async register(req: Request, res: Response, next: NextFunction): Promise<IAuth | ErrorHandler | void> {
        const { email, password, fullname, phone } = req.body;
        try {
            const responsedefault = await this.typeUserUseCase.getTypeUsers()
            const def = responsedefault?.filter(item => item.name === 'Customer')
            const TypeUser_id = def?.map(item => item._id)
            const response = await this.authUseCase.signUp({ fullname, email, password, phone, type_user: TypeUser_id });
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler(`Error:${error}`, 500));
        }
    }

    public async registerAndPay(req: Request, res: Response, next: NextFunction): Promise<IAuth | ErrorHandler | void> {
        const { email, password, fullname } = req.body;
        try {
            const responsedefault = await this.typeUserUseCase.getTypeUsers()
            const def = responsedefault?.filter(item => item.name === 'Customer')
            const TypeUser_id = def?.map(item => item._id)
            const response = await this.authUseCase.signUp2({ fullname, email, password, type_user: TypeUser_id });
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler(`Error:${error}`, 500));
        }
    }


    public async registerAdmin(req: Request, res: Response, next: NextFunction): Promise<IAuth | ErrorHandler | void> {
        const { email, password, fullname, phone } = req.body;

        try {
            const responsedefault = await this.typeUserUseCase.getTypeUsers()
            const def = responsedefault?.filter(item => item.name === 'Admin')
            const TypeUser_id = def?.map(item => item._id)
            const response = await this.authUseCase.signUp({ fullname, email, password, phone, type_user: TypeUser_id });
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            console.log(error)
            next(new ErrorHandler('Hubo un error al iniciar sesión', 500));
        }
    }

    public async loginWithGoogle(req: Request, res: Response, next: NextFunction): Promise<IAuth | ErrorHandler | void> {
        const { idToken } = req.body;
        try {
            const response = await this.authUseCase.signInWithGoogle(idToken);
            
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Usuario no registrado', 500));
        }
    }
    public async loginWithGooglePartner(req: Request, res: Response, next: NextFunction): Promise<IAuth | ErrorHandler | void> {
        const { idToken } = req.body;
        try {
            const response = await this.authUseCase.signInWithGooglePartner(idToken);
            
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Usuario no registrado', 500));
        }
    }

    public async registerByGoogle(req: Request, res: Response, next: NextFunction): Promise<IAuth | ErrorHandler | void> {
        const { idToken } = req.body;
        
    
        try {
            const response = await this.authUseCase.signUpWithGoogle(idToken);
            
            if (!(response instanceof ErrorHandler)) {
                const responsedefault = await this.typeUserUseCase.getTypeUsers();
                const def = responsedefault?.filter(item => item.name === 'Customer');
                const TypeUser_id = def?.map(item => item._id);
                // const code = generateRandomCode();
                const resp = await this.authUseCase.signUp2({email: response?.email, fullname:response?.fullname, type_user: TypeUser_id, google: true, profile_image : response?.picture })
                // const resp = await this.authUseCase.signUpPlatform({ email: response?.email, fullname: response?.fullname, accountVerify: code, type_user: TypeUser_id, google: true });

                this.invoke(resp, 200, res, '', next);
            } else {
                this.invoke(response, 200, res, '', next);
            }
        } catch (error) {
            next(new ErrorHandler('Hubo un error al registrar', 500));
        }
    }
    


    public async changePassword(req: Request, res: Response, next: NextFunction): Promise<IAuth | ErrorHandler | void> {
        const { password, new_password } = req.body;
        const { id } = req.params;
        try {
            const response = await this.authUseCase.changePassword(password, new_password, id);
            this.invoke(response, 200, res, 'La contraseña se cambio con exito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al cambiar la contraseña', 500));
        }
    }

    public async uploadProfilePhoto(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        try {
            const pathObject = `${this.path}/${id}/${req.file?.fieldname}`;
            const { url, success, message } = await this.s3Service.uploadToS3AndGetUrl(pathObject + '.jpg', req.file, 'image/jpeg');
            if (!success) return new ErrorHandler('Hubo un error al subir la imagen', 400)
            const response = await this.authUseCase.updateProfilePhoto(pathObject, id);
            response.profile_image = url;
            this.invoke(response, 200, res, message, next);
        } catch (error) {
            console.log(error)
            next(new ErrorHandler('Hubo un error al subir la foto', 500));
        }
    }



    public async revalidateToken(req: Request, res: Response, next: NextFunction) {

        const { user } = req;

        try {
            const find = await this.authUseCase.findUser(user.email);
            const  url  = await this.s3Service.getUrlObject(find.profile_image + ".jpg")
           find.profile_image = url
            const response = await this.authUseCase.generateToken(find);
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al generar el token', 500));
        }
    }

    public async savePhone(req: Request, res: Response, next: NextFunction) {
        const { phone_number, prefix }: IPhoneRequest = req.body;

        try {

            const code = generateRandomCode();
            const vcode = parseInt(code)

            // await this.twilioService.sendSMS(`Codigo de verificacion CarWash autolavado y más- ${code}`);
            const response = await this.authUseCase.findPhone(phone_number)

            this.invoke(response, 200, res, 'El telefono se registro correctamente', next);
        } catch (error) {
            console.log(error);

            next(new ErrorHandler('Hubo un error al guardar el telefono', 500));
        }
    }

    public async verifyCode(req: Request, res: Response, next: NextFunction) {
        const { user } = req;
        const { code } = req.body;
        try {
            const response = await this.authUseCase.verifyPhoneNumber(user._id, +code);
            this.invoke(response, 200, res, 'El código de verificación se envió correctamente', next);
        } catch (error) {
            next(new ErrorHandler('El codigo no se ha enviado', 500));
        }
    }



    

}