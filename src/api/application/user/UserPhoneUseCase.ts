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
  public async findPhone(phone_number: string): Promise<IPhone | ErrorHandler | null> {
    return await this.phoneRepository.findByPhoneNumber(phone_number)
 }
  public async createUserPhone(phone: IPhone): Promise<IPhone | ErrorHandler | null> { 
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