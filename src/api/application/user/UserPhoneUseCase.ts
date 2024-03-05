import { Authentication } from '../authentication/AuthenticationService';
import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { IPhone, IPhoneResponse } from '../../domain/user/UserEntity';
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
  public async getPhone(id: string): Promise< IPhoneResponse | ErrorHandler | null> {
    const phone = await this.phoneRepository.findById(id);
    if (!phone) {
        return new ErrorHandler('El teléfono no fue encontrado', 404);
    }
    const phoneResponse : IPhoneResponse = { phone_id: phone._id, verified: phone.verified, phone_number: phone.phone_number };
    return phoneResponse;
}
 
  public async findPhone(phone_number: string): Promise<IPhoneResponse | ErrorHandler > {
   
    const phone = await this.phoneRepository.findOneItem({phone_number:phone_number})
    if (!phone) {
        return new ErrorHandler('El teléfono no fue encontrado', 404);
    }
    const phoneResponse : IPhoneResponse = { phone_id: phone._id, verified: phone.verified, phone_number: phone.phone_number };
    return phoneResponse;
 }
  public async createUserPhone(phone: IPhone, phoneNumber: string): Promise<IPhone |IPhoneResponse | ErrorHandler | null> {
    const noRepeat = await this.phoneRepository.findByPhoneNumber(phoneNumber)
    if (noRepeat.length > 0 ) return new ErrorHandler('El telefono ya ha sido registrado',400);
    else{
    const phone1 = await this.phoneRepository.createOne(phone)
    const phoneResponse : IPhoneResponse = { phone_id: phone1._id, verified: phone1.verified, phone_number: phone1.phone_number };
    return phoneResponse;
    }
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
  public async deletePhysicalPhone(id: string): Promise<IPhone | ErrorHandler | null> {
    return await this.phoneRepository.PhysicalDelete(id)
  }
 

}