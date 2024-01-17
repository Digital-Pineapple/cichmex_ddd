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

    public async createNewTypeUser(name: any, type: any): Promise<TypeUserEntity | ErrorHandler> {
        try {
          const typeUser = await this.typeUserRepository.findOneItem({ name });
          
          if (typeUser) {
            // Si ya existe, devuelve un error
            return new ErrorHandler('El tipo de usuario ya existe', 400);
          } else {
            // Si no existe, crea uno nuevo
            const newTypeUser = await this.typeUserRepository.createOne({ name, type });
            return newTypeUser;  // Puedes retornar el nuevo tipo de usuario creado
          }
        } catch (error) {
          // Manejar otros errores aquí si es necesario
          console.error(error);
          return new ErrorHandler('Error al crear ', 500);
        }
      }

    public async updateTypeUser(_id: string, updated :object): Promise<TypeUserEntity | null> {
        return await this.typeUserRepository.updateOne(_id, updated);
    }

    public async deleteTypeUser(_id: string): Promise<TypeUserEntity | null> {
        return await this.typeUserRepository.updateOne(_id,{deleted:true})
    }

}