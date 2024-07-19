import { Authentication, IGoogle, IGoogleReg, IGoogleRegister, IGoogleResponse, IGoogleResponseLogin, IdUserAndVerified } from '../authentication/AuthenticationService';

import { AuthRepository } from '../../domain/auth/AuthRepository';
import { ErrorHandler } from '../../../shared/domain/ErrorHandler';

import { IAuth } from '../authentication/AuthenticationService';

import { MomentService } from '../../../shared/infrastructure/moment/MomentService';
import { IFileKeys, IPhoneRequest } from './interfaces';
import { UserEntity } from '../../domain/user/UserEntity';
import { BranchPopulateConfig, PhonePopulateConfig, PopulatePointStore, TypeUserPopulateConfig, UserPopulateConfig } from '../../../shared/domain/PopulateInterfaces'
import { TokenEntity, TokenRPEntity } from '../../domain/auth/authEntities';

export class AuthUseCase extends Authentication {

    constructor(private readonly authRepository: AuthRepository) {
        super();
    }

    async signIn(email: string, password: string): Promise<ErrorHandler | IAuth> {

        const user = await this.authRepository.findOneItem({ email }, TypeUserPopulateConfig, PhonePopulateConfig,PopulatePointStore);
        
        if (!user) return new ErrorHandler('No exite este usuario', 400);
        const validatePassword = this.decryptPassword(password, user.password)

        if (!validatePassword) return new ErrorHandler('El usuario o contraseña no son validos', 400);
        return await this.generateJWT(user,user.uuid);
    }

    async signInAdmin(email: string, password: string): Promise<ErrorHandler | IAuth> {

        const user = await this.authRepository.findOneItem({ email }, TypeUserPopulateConfig, PhonePopulateConfig,PopulatePointStore);
        
        if (!user) return new ErrorHandler('No exite este usuario', 400);
        const validatePassword = this.decryptPassword(password, user.password)
        if (user.type_user.name !== 'Admin') {
            return new ErrorHandler('No es un Admin', 400);
        }

        if (!validatePassword) return new ErrorHandler('El usuario o contraseña no son validos', 400);
        return await this.generateJWT(user, user.uuid);
    }
    async signInPartner(email: string, password: string): Promise<ErrorHandler | IAuth> {
        try {
            const user = await this.authRepository.findOneItem({ email: email, status: true }, TypeUserPopulateConfig, PhonePopulateConfig, PopulatePointStore);
    
            if (!(user instanceof ErrorHandler) && user !== null ) {
    
                const validatePassword = this.decryptPassword(password, user.password);
    
                if (!validatePassword) {
                    return new ErrorHandler('El usuario o contraseña no son válidos', 400);
                }
    
                return await this.generateJWT(user, user.uuid);
            } else {
                return new ErrorHandler('No existe este usuario', 400);
            }
        } catch (error) {
            // Manejo adicional de errores, si es necesario
            return new ErrorHandler('Error en el servidor', 500);
        }
    }
    


    async findUser(body:any): Promise<UserEntity> {
        const user = await this.authRepository.findOneItem({ ...body },PhonePopulateConfig, TypeUserPopulateConfig);
        
        return await (user);
    }

    async findPhone(phone: number): Promise<ErrorHandler | UserEntity> {
        const phoneString = phone.toString()
        let phone_number = await this.authRepository.findOneItem({ phone: { phone_number: phoneString } }, UserPopulateConfig);
        return await (phone_number);
    }


    async signUp(body: any): Promise<IGoogleResponse | ErrorHandler | null> {
        try {
            const user = await this.authRepository.findOneItem({ email: body.email });

            if (user) {
                if (user.email_verified === false) {
                    const userResponse = { user_id: user._id, verified: user.email_verified, email: user.email };
                    return userResponse;
                } else {
                    return new ErrorHandler('Este correo ya se encuentra verificado', 409);
                }
            } else {
                 const newPassword = await this.encryptPassword(body.password)
                const newUser = await this.authRepository.createOne({ ...body,password:newPassword });
                const newUserResponse = { user_id: newUser._id, verified: newUser.email_verified, email: newUser.email };
                return newUserResponse;
            }
        } catch (error) {

            throw new ErrorHandler('Error en el proceso de registro', 500);
        }
    }

    async signUp2(body: any): Promise<IGoogleReg | IAuth | ErrorHandler | null> {
        try {
            const user = await this.authRepository.findOneItem({ email: body.email, status:true });
            
            if (user) {
                    return new ErrorHandler('Este correo ya se encuentra registrado', 409);
                
            } else {
                const password = await this.encryptPassword(body.password);
                const newUser = await this.authRepository.createOne({ ...body, password});
                const userDetail = await this.authRepository.findByIdPupulate(newUser._id, TypeUserPopulateConfig)                
                const user = this.generateJWT(userDetail, userDetail.uuid)
                return user;
            }
        } catch (error) {
            throw new ErrorHandler('Error en el proceso de registro', 500);
        }
    }

    async signUpPlatform(body: any): Promise<IGoogleReg | IAuth | ErrorHandler | null>  {
        try {
            const user = await this.authRepository.findOneItem({ email: body.email, status:true })
            
            if (user) {
                    return new ErrorHandler('Este correo ya se encuentra registrado', 409);
                
            } else {
                const newUser = await this.authRepository.createOne({ ...body});
                const userDetail = await this.authRepository.findByIdPupulate(newUser._id, TypeUserPopulateConfig)                
                const user = this.generateJWT(userDetail, userDetail.uuid)
                return user;
            }
        } catch (error) {
            throw new ErrorHandler('Error en el proceso de registro', 500);
        }
    }

    async signUpByPhone(body: any): Promise<IAuth | ErrorHandler | null> {


        let user = await this.authRepository.findOneItem({ phone: body.phone }, UserPopulateConfig);

        if (user) return new ErrorHandler('El usuario ya ha sido registrado', 400);

        user = await this.authRepository.createOne({});

        return await this.generateJWT(user, user.uuid);
    }

    async signInWithGoogle(idToken: string): Promise<IGoogleResponseLogin | IAuth | ErrorHandler | null> {
        let { email, picture } = await this.validateGoogleToken(idToken);
        
        let user = await this.authRepository.findOneItem({ email },TypeUserPopulateConfig, PhonePopulateConfig,PopulatePointStore);
        if (!user) return new ErrorHandler('No existe usuario', 409)
        user.profile_image = picture
        user = await this.generateJWT(user, user.uuid)
        return user
    }

    async signInWithGooglePartner(idToken: string): Promise<IGoogleResponseLogin | IAuth | ErrorHandler | null> {
        let { email, picture } = await this.validateGoogleToken(idToken);
        
        let user = await this.authRepository.findOneItem({ email },TypeUserPopulateConfig, PhonePopulateConfig,PopulatePointStore);

        if (user.type_user.name !== 'Partner') {
            return new ErrorHandler('No es un socio', 400);
        }
        if (!user) return new ErrorHandler('No existe usuario', 409)
        user.profile_image = picture
        user = await this.generateJWT(user, user.uuid)
        
        return user
    }

    async signUpWithGoogle(idToken: string): Promise<IGoogle | ErrorHandler | null> {

        let {email,fullname,picture} = await this.validateGoogleToken(idToken);
        
        
        let user = await this.authRepository.findOneItem({ email: email, status:true }, TypeUserPopulateConfig,PhonePopulateConfig)
        if (user) {
            return new ErrorHandler('El usuario ya exite favor de iniciar sesión', 401)
        }
        if (!user) {
            user = { email, fullname, picture }
        }

        return user
       

    }

    async changePassword(password: string, newPassword: string, id: string): Promise<ErrorHandler | IAuth | null> {
        let customer = await this.authRepository.findById(id);
        const currentPassword = this.decryptPassword(password, customer.password);
        if (!currentPassword) return new ErrorHandler('Error la contraseña actual no es valida', 400);
        const newPass = this.encryptPassword(newPassword);
        return await this.authRepository.updateOne(customer._id, { password: newPass });
    }

    async restorePassword(user_id: string, newPassword: string): Promise<ErrorHandler | UserEntity | null> {
        const user = await this.authRepository.findById(user_id)
        const newPass = this.encryptPassword(newPassword);
        return await this.authRepository.updateOne(user._id, { password: newPass, verify_code:'' });
    }

    async ValidateCodeEmail(email: string, code: number): Promise<TokenRPEntity| ErrorHandler| null> {
        const user = await this.authRepository.verifyUserCode(email,code)
        
        if (user) {
            const {token, verify} = await this.generateJWTRP(user._id)
            return {token,verify}
        } else {
            return new ErrorHandler('No coincide el código', 500)
        }
    }

    async updateProfilePhoto(photo: string, customer_id: string): Promise<UserEntity> {
        return await this.authRepository.updateOne(customer_id, { profile_image: photo });
    }

    async updateCustomer(customer_id: string, email: string, fullname: string): Promise<UserEntity> {
        return await this.authRepository.updateOne(customer_id, { email, fullname });
    }
    async updateCodeUser(user_id: string, code:number, attemps: number): Promise<UserEntity> {
        return await this.authRepository.updateOne(user_id, { verify_code: {code: code, attemps: attemps} });
    }

    async generateToken(user: UserEntity, infoToken:any) {
        return await this.generateJWT(user, infoToken)
    }

    async registerPhoneNumber(user: UserEntity | UserEntity, phone: IPhoneRequest, code: number) {
        const { phone_number, prefix } = phone;

        const phoneData = await this.authRepository.validatePhoneNumber(phone_number, user._id);
        if (phoneData) return new ErrorHandler('El telefono ya ha sido registrado', 400);

        const data = { phone: { code, prefix, phone_number, expiration_date: new MomentService().addMinutesToDate(5) } }
        return await this.authRepository.updateOne(user._id, data,);
    }


    async verifyPhoneNumber(_id: string, currentCode: number) {
        const customer = await this.authRepository.findById(_id,);
        if (!customer.phone.phone_number) return new ErrorHandler('Ingresa un numero telefonico antes de continuar', 400);

        if (customer.phone.verified) return new ErrorHandler('El telefono ya ha sido verificado', 400);

        const { expiration_date, code } = customer.phone;
        if (code !== currentCode) return new ErrorHandler('El código no es correcto', 400)
        if (!new MomentService().verifyExpirationDate(expiration_date)) return new ErrorHandler('El código ha expirado', 400);

        return await this.authRepository.verifyCode(customer._id);
    }

    async uploadCustomerFiles(customer_id: string, keys: Array<IFileKeys>) {
        let customer = await this.authRepository.findById(customer_id,);
        keys.forEach(async ({ key, field }) => {
            customer[field] = key
        })
        return await customer.save();

    }

    async registerPhone(phone: IPhoneRequest) {
        const response = await this.authRepository.findAll()
        return response

    }

}