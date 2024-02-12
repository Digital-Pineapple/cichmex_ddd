import { Authentication, IAuth, IGoogleResponse } from '../authentication/AuthenticationService';
import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { IPhone, UserEntity } from '../../domain/user/UserEntity';
import { UserRepository } from '../../domain/user/UserRepository';
import { TypeUserPopulateConfig, PhonePopulateConfig, PopulatePointStore } from '../../../shared/domain/PopulateInterfaces';
export class UserUseCase extends Authentication {

  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  public async allUsers(): Promise<UserEntity[] | ErrorHandler | null> {
    return await this.userRepository.findAll(TypeUserPopulateConfig,PhonePopulateConfig)
  }
  public async getUser(id: string): Promise<UserEntity | ErrorHandler | null > {
    return await this.userRepository.findAllAll(id)
 }
  public async getOneUser(id: string): Promise<UserEntity | ErrorHandler | null > { 
     return await this.userRepository.findAllAll(id, TypeUserPopulateConfig,PhonePopulateConfig, PopulatePointStore)
  }
  public async getUserEmail(id: string): Promise<IGoogleResponse | ErrorHandler | null > {
  const user = await this.userRepository.findOneItem({_id:id})
    const user2: IGoogleResponse = {user_id : user?._id, verified : user?.email_verified, email:user?.email}
    return user2
 }

  public async updateUser(id: string, updated:object): Promise<UserEntity | ErrorHandler | null> {
   
    return await this.userRepository.updateOne(id,{...updated})
  }
  public async updateStore(id: string, updated:object): Promise<UserEntity | ErrorHandler | null> {
   console.log(updated);
   
    return await this.userRepository.updateOne(id,{updated})
  }

  public async updateRegisterUser(id: string, updated:object): Promise<IAuth | ErrorHandler | null> {
     let user = await this.userRepository.updateOne(id,updated)
     return await this.generateJWT(user);
  }

  public async deleteUser(id: string): Promise<UserEntity | ErrorHandler | null> {
    return await this.userRepository.PhysicalDelete(id)
  }
  public async findUser(email:string): Promise<UserEntity | ErrorHandler | null> {
    return await this.userRepository.findOneItem({email:email})

  }
  public async findUserByPhone(phone_id:string): Promise<UserEntity | ErrorHandler | null> {
    return await this.userRepository.findOneItem({phone_id:phone_id})

  }
  public async createUser(body:any): Promise<UserEntity | IAuth |  ErrorHandler | null> {
    let user = await this.userRepository.findOneItem({ email: body.email }, TypeUserPopulateConfig);
        if (user) return new ErrorHandler('El usuario ya existe',400);
        const password = await this.encryptPassword(body.password);
        const user1 = await this.userRepository.createOne({ ...body, password });
        return await this.generateJWT(user1);
    
  }

  async signInByPhone(phone_id: string, password: string): Promise<ErrorHandler | IAuth> {
    const user = await this.userRepository.findOneItem({phone_id}, TypeUserPopulateConfig, PhonePopulateConfig,PopulatePointStore)
    if (user.type_user.name !== 'Partner') {
      return new ErrorHandler('No es un socio', 400);
    }
    
    if (!user) return new ErrorHandler('No exite este usuario', 400);
    const validatePassword = this.decryptPassword(password, user.password)
    if (!validatePassword) return new ErrorHandler('El usuario o contraseña no son validos', 400);
    return await this.generateJWT(user);
}
async signInByPhonePartner(phone_id: string, password: string): Promise<ErrorHandler | IAuth> {
  const user = await this.userRepository.findOneItem({phone_id}, TypeUserPopulateConfig, PhonePopulateConfig,PopulatePointStore)
  if (!user) return new ErrorHandler('No exite este usuario', 400);
  const validatePassword = this.decryptPassword(password, user.password)
  if (!validatePassword) return new ErrorHandler('El usuario o contraseña no son validos', 400);
  return await this.generateJWT(user);
}


}