import { Authentication } from '../authentication/AuthenticationService';
import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { IEmployeeResponse, IPhone, IPhoneResponse } from '../../domain/user/UserEntity';
import { PhoneRepository } from '../../domain/user/PhoneRepository';
import { AddressRepository } from '../../domain/adresses/AddressRepository';
import { AddressEntity } from '../../domain/adresses/AddressEntity';

export class AddressUseCase {
  constructor(private readonly addresRepository: AddressRepository) {}

  public async getAddressesByUser(_id: string): Promise<AddressEntity[] | ErrorHandler | null> {
    return await this.addresRepository.findAddressesByUser(_id);
  }
  public async createAddress(_id: string, body: any): Promise<AddressEntity  | null> {
    return await this.addresRepository.createOneAddress(_id, body);
  }
  public async updateAddress(_id: string, body: any): Promise<AddressEntity  | null> {
    return await this.addresRepository.updateOneAddress(_id, body);
  }
  public async deleteAddress(_id: string): Promise<AddressEntity  | null> {
    return await this.addresRepository.deleteOneAddress(_id);
  }
 

}