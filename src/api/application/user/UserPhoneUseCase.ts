import { Authentication } from '../authentication/AuthenticationService';
import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { IPhone } from '../../domain/user/UserEntity';
import { PhoneRepository } from '../../domain/user/PhoneRepository';
import { IPhoneRequest } from '../auth/interfaces';
export class UserPhoneUseCase extends Authentication {

    constructor(private readonly phoneRepository: PhoneRepository) {
        super();
    }

    public async createUserPhone(
       phone : IPhoneRequest
      ): Promise< IPhone | ErrorHandler | null> {
        const noRepeat = await this.phoneRepository.findOneItem({phone: phone})
        if (noRepeat) return new ErrorHandler("Telefono ya registrado", 400);
        return await this.phoneRepository.createOne(phone)
      }

}