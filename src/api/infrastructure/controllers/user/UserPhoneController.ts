import { NextFunction, Request, Response } from 'express';

import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { TwilioService } from '../../../../shared/infrastructure/twilio/TwilioService';

import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { generateRandomCode } from '../../../../shared/infrastructure/validation/Utils';
import { UserPhoneUseCase } from '../../../application/user/UserPhoneUseCase';
import { IPhone } from '../../../domain/user/UserEntity';
import { IPhoneRequest } from '../../../application/auth/interfaces';


export class UserPhoneController extends ResponseData {
    protected path = '/user-phone';

    constructor(private readonly phoneUserUseCase : UserPhoneUseCase ,
          private readonly twilioService: TwilioService
          ) {
        super();
        this.registerByPhone                      =   this.registerByPhone.bind(this);
          
    }

    public async registerByPhone(req: Request, res: Response, next: NextFunction): Promise<IPhone | ErrorHandler | void> {
        const { prefix, phone_number } : IPhoneRequest = req.body;
        try {
            const code = generateRandomCode()
            await this.twilioService.sendSMS(`Verifica tu número de teléfono con el siguiente codigo - ${code}`)
            const response = this.phoneUserUseCase.createUserPhone(phone)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            console.log(error)
            next(new ErrorHandler('Hubo un error al iniciar sesión', 500));
        }
    }


    

}