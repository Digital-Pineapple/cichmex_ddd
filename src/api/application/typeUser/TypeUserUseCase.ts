import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { TypeUserEntity } from '../../domain/typeUser/TypeUserEntity';
import { TypeUserRepository } from '../../domain/typeUser/TypeUserRepository';

export class TypeUserUseCase {
    constructor(private typeUserRepository: TypeUserRepository ) { }

    public async getTypeUsers(): Promise<TypeUserEntity[] | null> {
        return await this.typeUserRepository.findAll()
    }

    public async getTypeUser(_id: string): Promise<TypeUserEntity | null> {
        return await this.typeUserRepository.findById(_id);
    }
    public async findTypeUser(body:any): Promise<TypeUserEntity | null> {
      return await this.typeUserRepository.findOneItem({...body, status:true});
  }

    public async createNewTypeUser(body: any, uuid:any): Promise<TypeUserEntity | ErrorHandler> {
        try {
          const typeUser = await this.typeUserRepository.findOneItem({...body});
          if (typeUser) {
            return new ErrorHandler('Tipo de usuario ya existe', 500);
          }
            const newTypeUser = await this.typeUserRepository.createOne({...body, uuid });
            return newTypeUser
          }
         catch (error) {
          // Manejar otros errores aquí si es necesario
          return new ErrorHandler('Error al crear ', 500);
        }
      }

    public async updateTypeUser(_id: string, updated :object): Promise<TypeUserEntity | null> {
        return await this.typeUserRepository.updateOne(_id, updated);
    }

    public async deleteTypeUser(_id: string): Promise<TypeUserEntity | null> {
        return await this.typeUserRepository.updateOne(_id,{status:false})
    }

}