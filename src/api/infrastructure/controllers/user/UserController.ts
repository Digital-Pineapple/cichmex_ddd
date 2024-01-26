import { NextFunction, Request, Response } from 'express';

import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { TwilioService } from '../../../../shared/infrastructure/twilio/TwilioService';

import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { generateRandomCode } from '../../../../shared/infrastructure/validation/Utils';
import { UserPhoneUseCase } from '../../../application/user/UserPhoneUseCase';
import { IPhone, UserEntity } from '../../../domain/user/UserEntity';
import { UserUseCase } from '../../../application/user/UserUseCase';
import { TypeUserUseCase } from '../../../application/typeUser/TypeUserUseCase';


export class UserController extends ResponseData {
    protected path = '/user';

    constructor(private readonly phoneUserUseCase : UserPhoneUseCase ,
        private readonly userUseCase : UserUseCase,
        private readonly typeUserUseCase : TypeUserUseCase,
          private readonly twilioService: TwilioService
          ) {
        super();
        this.allPhones           = this.allPhones.bind(this);
        this.allUsers           = this.allUsers.bind(this);
        this.getUser            = this.getUser.bind(this);
        this.sendCode            =   this.sendCode.bind(this);
        this.resendCode         = this.resendCode.bind(this);
        this.verifyPhone         = this.verifyPhone.bind(this);
        this.deletePhone        = this.deletePhone.bind(this);   
        this.signUpByPhone    = this.signUpByPhone.bind(this);                    
          
    }


    public async allPhones(req: Request, res: Response, next: NextFunction): Promise<IPhone | ErrorHandler | void> {
        try {
            const response = await this.phoneUserUseCase.allPhones()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async allUsers(req: Request, res: Response, next: NextFunction): Promise<UserEntity[] | ErrorHandler | void> {
        try {
            const response = await this.userUseCase.allUsers()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getUser(req: Request, res: Response, next: NextFunction): Promise<UserEntity | ErrorHandler | void> {
        const { id } = req.params
        try {
            const response = await this.userUseCase.getOneUser(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async sendCode(req: Request, res: Response, next: NextFunction): Promise<IPhone | ErrorHandler | void> {
        const { prefix, phone_number }  = req.body;
        console.log(req.body);
        
        try {
            const code = generateRandomCode();
            const newPhone = await this.phoneUserUseCase.createUserPhone({ code, phone_number:phone_number, prefix }, phone_number); 
            this.invoke(newPhone, 200, res, '', next);
          } catch (error) {
            console.error('Error:', error);
            this.invoke(error, 500, res, 'Error interno del servidor', next);
          }
         
    }
    public async resendCode(req: Request, res: Response, next: NextFunction): Promise<IPhone | ErrorHandler | void> {
        const { id }  = req.params;
        try {
            const newcode = generateRandomCode()
            const response = await this.phoneUserUseCase.getOnePhone(id)
            if (!(response instanceof ErrorHandler) && response?.phone_number !== undefined && response.prefix !== undefined) {
            const phoneC = response?.prefix + response?.phone_number
            const phoneString = phoneC.toString()
            const updated = await this.phoneUserUseCase.updateUserPhone(id, {code: newcode})
            // const info =  await this.twilioService.sendSMS(phoneString,`CarWash autolavado y más. Código de verificación - ${newcode}`)
           return this.invoke(updated,400,res,'',next)
           }
        } catch (error) {
            console.log(error)
            next(new ErrorHandler('Hubo un error al enviar código de verificacion', 500));
        }
    }
    public async verifyPhone(req: Request, res: Response, next: NextFunction): Promise<IPhone | ErrorHandler | void> {
        const { id } = req.params
        const { code }  = req.body;
        try {
            const infoPhone  = await this.phoneUserUseCase.getOnePhone(id)
            
            if (!(infoPhone instanceof ErrorHandler)) {
                if (infoPhone?.code === code) {
                   const verified = await this.phoneUserUseCase.verifyCode(id)
                   this.invoke(verified,200,res,'',next)
                } else {
                    next (new ErrorHandler('El codigo no coincide', 400))
                }
            }
        } catch (error) {
            console.log(error)
            next(new ErrorHandler('Hubo un error al iniciar sesión', 500));
        }
    }

    public async deletePhone(req: Request, res: Response, next: NextFunction): Promise<IPhone | ErrorHandler | void> {
        const { id } = req.params
        try {
            const response = await this.phoneUserUseCase.deletePhone(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al eliminar', 500));
        }
    }
    public async signUpByPhone(req: Request, res: Response, next: NextFunction): Promise<UserEntity | ErrorHandler | void> {
        const{fullname,email, password, phone_id} = req.body
        try {
    
                const responsedefault = await this.typeUserUseCase.getTypeUsers()
                const def = responsedefault?.filter(item => item.name === 'Customer')
                const TypeUser_id = def?.map(item => item._id)
                const response = await this.userUseCase.createUser({fullname,email,password,phone_id, type_user: TypeUser_id})
                this.invoke(response, 200, res, '', next);
                

        } catch (error) {
            console.log(error)
            next(new ErrorHandler('Hubo un error al iniciar sesión', 500));
        }
    }

  



    

}