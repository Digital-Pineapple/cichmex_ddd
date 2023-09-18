import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { CarDetailRepository } from '../../domain/carDetail/CarDetailRepository';
import { CarDetail } from '../../domain/carDetail/CarDetailEntity';


export class CarDetailUseCase {

    constructor(private readonly carDetailRepository: CarDetailRepository) { }

    public async getAllCarDetail(): Promise<CarDetail[] | ErrorHandler | null> {
        return await this.carDetailRepository.findAll();
    }

    public async getDetailCarDetail(_id: string): Promise<CarDetail  | null> {
        return await this.carDetailRepository.findById(_id);
    }

    public async createNewCarDetail(name: string, description: string, status: boolean): Promise<CarDetail | ErrorHandler | null> {
        const carDetail1 = await this.carDetailRepository.findOneItem ({name});
        if (carDetail1) return new ErrorHandler('AutoRegistrado',400);
        return await this.carDetailRepository.createOne({ name, description, status });
    }

    public async updateOneCarDetail(_id: string,updated: CarDetail): Promise<CarDetail | null> {
        return await this.carDetailRepository.updateOne(_id,updated);
    }
    public async deleteOneCarDetail(_id: string): Promise<CarDetail | null> {
        return this.carDetailRepository.updateOne(_id, {status: false})
    }
    

}