import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { IService, TypeCarEntity } from '../../domain/typeCar/TypeCarEntity';
import { TypeCarRepository } from '../../domain/typeCar/TypeCarRepository';

export class TypeCarUseCase {
    constructor(private typeCarRepository: TypeCarRepository) { }

    public async getTypeCars(): Promise<TypeCarEntity[] | null> {
        return await this.typeCarRepository.findAll();
    }

    public async getTypeCar(_id: string): Promise<TypeCarEntity | null> {
        return await this.typeCarRepository.findById(_id);
    }

    public async createNewTypeCar(name:string, status: boolean):Promise<TypeCarEntity | null> {
        const typeCar = await this.typeCarRepository.findOneItem({name});
        if (typeCar) return new ErrorHandler('El servicio ha sido registrado',400);
        return await this.typeCarRepository.createOne({ name, status });
    }

    public async updateTypeCar(_id: string, updated : TypeCarEntity): Promise<TypeCarEntity | null> {
        return await this.typeCarRepository.updateOne(_id, updated);
    }

    public async updateTypeCarService(_id: string, updated: IService): Promise<TypeCarEntity | null> {
        return await this.typeCarRepository.updateOne(_id, updated);
    }

    public async deleteTypeCar(_id: string): Promise<TypeCarEntity | null> {
        return await this.typeCarRepository.deleteOneTypeCar(_id);
    }

    public async deleteTypeCarService(_id: string): Promise<TypeCarEntity | null> {
        return await this.typeCarRepository.deleteOneTypeCar(_id);
    }

}