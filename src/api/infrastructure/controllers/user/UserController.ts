import { NextFunction, Request, Response } from 'express';

import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { TwilioService } from '../../../../shared/infrastructure/twilio/TwilioService';

import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { generateRandomCode } from '../../../../shared/infrastructure/validation/Utils';
import { UserPhoneUseCase } from '../../../application/user/UserPhoneUseCase';
import { IPhone, UserEntity } from '../../../domain/user/UserEntity';
import { UserUseCase } from '../../../application/user/UserUseCase';
import { TypeUserUseCase } from '../../../application/typeUser/TypeUserUseCase';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';


export class UserController extends ResponseData {
    protected path = '/user';

    constructor(private readonly phoneUserUseCase: UserPhoneUseCase,
        private readonly userUseCase: UserUseCase,
        private readonly typeUserUseCase: TypeUserUseCase,
        private readonly twilioService: TwilioService,
        private readonly s3Service: S3Service,
    ) {
        super();
        this.allPhones = this.allPhones.bind(this);
        this.onePhone = this.onePhone.bind(this);
        this.allUsers = this.allUsers.bind(this);
        this.getUser = this.getUser.bind(this);
        this.sendCode = this.sendCode.bind(this);
        this.resendCode = this.resendCode.bind(this);
        this.verifyPhone = this.verifyPhone.bind(this);
        this.deletePhone = this.deletePhone.bind(this);
        this.signUpByPhone = this.signUpByPhone.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);

    }


    public async allPhones(req: Request, res: Response, next: NextFunction): Promise<IPhone | ErrorHandler | void> {
        try {
            const response = await this.phoneUserUseCase.allPhones()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async onePhone(req: Request, res: Response, next: NextFunction): Promise<IPhone | ErrorHandler | void> {
        const { id } = req.params
        try {
            const response = await this.phoneUserUseCase.getOnePhone(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async allUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const response = await this.userUseCase.allUsers();
          if (response instanceof ErrorHandler) {
            this.invoke(response, 500, res, 'Hubo un error al consultar la información', next);
            return;
          }
      
          if (response) {
            await Promise.all(
              response.map(async (customer: any) => {
                if (!customer.google) {
                  const url = await this.s3Service.getUrlObject(customer.profile_image + ".jpg");
                  customer.profile_image = url;
                }
              })
            );
          }
      
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
        const { phone_number, prefix } = req.body;

        try {
            const code = generateRandomCode();
            // const phoneC = prefix + phone_number
            // const phoneString = phoneC.toString()
            // const info =  await this.twilioService.sendSMS(phoneString,`CarWash autolavado y más. Código de verificación - ${code}`)
            const newPhone = await this.phoneUserUseCase.createUserPhone({ code, phone_number: phone_number, prefix }, phone_number);
            this.invoke(newPhone, 200, res, '', next);
        } catch (error) {
            console.error('Error:', error);
            this.invoke(error, 500, res, 'Error interno del servidor', next);
        }

    }
    public async resendCode(req: Request, res: Response, next: NextFunction): Promise<IPhone | ErrorHandler | void> {
        const { id } = req.params;
        try {
            const newcode = generateRandomCode()
            const response = await this.phoneUserUseCase.getOnePhone(id)
            if (!(response instanceof ErrorHandler) && response?.phone_number !== undefined && response.prefix !== undefined) {
                const phoneC = response?.prefix + response?.phone_number
                const phoneString = phoneC.toString()
                const updated = await this.phoneUserUseCase.updateUserPhone(id, { code: newcode })
                const info = await this.twilioService.sendSMS(phoneString, `CarWash autolavado y más. Código de verificación - ${newcode}`)
                return this.invoke(updated, 400, res, '', next)
            }
        } catch (error) {
            console.log(error)
            next(new ErrorHandler('Hubo un error al enviar código de verificacion', 500));
        }
    }
    public async verifyPhone(req: Request, res: Response, next: NextFunction): Promise<IPhone | ErrorHandler | void> {
        const { id } = req.params
        const { code } = req.body;
        try {
            const infoPhone = await this.phoneUserUseCase.getOnePhone(id)

            if (!(infoPhone instanceof ErrorHandler)) {
                if (infoPhone?.code === code) {
                    const verified = await this.phoneUserUseCase.verifyCode(id)
                    this.invoke(verified, 200, res, '', next)
                } else {
                    next(new ErrorHandler('El codigo no coincide', 400))
                }
            }
        } catch (error) {
            console.log(error)
            next(new ErrorHandler('Hubo un error ', 500));
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
        const { fullname, email, password, phone_id } = req.body
        try {

            const responsedefault = await this.typeUserUseCase.getTypeUsers()
            const def = responsedefault?.filter(item => item.name === 'Customer')
            const TypeUser_id = def?.map(item => item._id)
            const response = await this.userUseCase.createUser({ fullname, email, password, phone_id, type_user: TypeUser_id })
            this.invoke(response, 200, res, '', next);


        } catch (error) {
            console.log(error)
            next(new ErrorHandler('Hubo un error al iniciar sesión', 500));
        }
    }
    public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<UserEntity | ErrorHandler | void> {
        const { id } = req.params
        try {
            const response = await this.userUseCase.deleteUser(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler(`Error: ${error}`, 500));
        }
    }
    public async updateUser(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { fullname, type_customer } = req.body;
        try {
            if (req.file) {
                const pathObject = `${this.path}/${id}/${fullname}`;
                const response = await this.userUseCase.updateUser(id,{ fullname, type_customer, profile_image: pathObject })
                if (!(response instanceof ErrorHandler)) {
                    const { url, success } = await this.s3Service.uploadToS3AndGetUrl(
                        pathObject + ".jpg",
                        req.file,
                        "image/jpeg"
                    );
                    if (!success)
                        return new ErrorHandler("Hubo un error al subir la imagen", 400);
                    if (response !== null) {
                        response.profile_image = url;
                    }
                }
                this.invoke(
                    response,
                    201,
                    res,
                    "El usuario se actualizó con éxito jsjs",
                    next
                );
            } else {
                const response = await this.userUseCase.updateUser(id, {
                    fullname,
                    type_customer,
                });
                this.invoke(
                    response,
                    201,
                    res,
                    "El usuario se actualizó con éxitojaja",
                    next
                );
            }
        } catch (error) {
            next(new ErrorHandler("Hubo un error al editar la información", 500));
        }
    }








}