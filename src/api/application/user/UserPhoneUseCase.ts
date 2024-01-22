import { Authentication } from '../authentication/AuthenticationService';
import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { IPhone } from '../../domain/user/UserEntity';
import { PhoneRepository } from '../../domain/user/PhoneRepository';
import { IPhoneRequest } from '../auth/interfaces';
export class UserPhoneUseCase extends Authentication {

  constructor(private readonly phoneRepository: PhoneRepository) {
    super();
  }

  public async allPhones(): Promise<IPhone[] | ErrorHandler | null> {
    return await this.phoneRepository.findAll()
  }
  public async getOnePhone(id: string): Promise<IPhone | ErrorHandler | null> {
     return await this.phoneRepository.findById(id)
  }


  public async createUserPhone(phone: IPhone): Promise<IPhone | ErrorHandler | null> {
    const noRepeat = await this.phoneRepository.findOneItem({ phone_number: phone.phone_number })
    if (noRepeat !== null) return new ErrorHandler("Telefono ya registrado", 400);
    return await this.phoneRepository.createOne(phone)
    
  }
  public async updateUserPhone(id: string, updated:object): Promise<IPhone | ErrorHandler | null> {
    return await this.phoneRepository.updateOne(id,updated)
  }
  public async verifyCode(id: string): Promise<IPhone | ErrorHandler | null> {
    return await this.phoneRepository.updateOne(id, { verified: true })
  }
  public async deletePhone(id: string): Promise<IPhone | ErrorHandler | null> {
    return await this.phoneRepository.updateOne(id, { deleted: true})
    

  }
 

}