import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { CarDetailRepository } from '../../domain/carDetail/CarDetailRepository';
import { CarDetail } from '../../domain/carDetail/CarDetailEntity';
import { Boolean } from 'aws-sdk/clients/batch';




export class CarDetailUseCase {

    constructor(private readonly carDetailRepository: CarDetailRepository) { }

    public async getAllCarDetail(): Promise<CarDetail[] | ErrorHandler | null> {
        return await this.carDetailRepository.findAll();
    }

    public async getDetailCarDetail(_id: string): Promise<CarDetail  | null> {
        return await this.carDetailRepository.findById(_id);
    }

    public async getDetailCarDetailByCustomer(_id: string): Promise<CarDetail  | ErrorHandler| null> {
        return await this.carDetailRepository.findByCustomer(_id);
    }
    public async getDetailCarDetailByPlateNumber(plate_number:string, customer_id: string): Promise<CarDetail  | ErrorHandler| null> {
        return await this.carDetailRepository.findByPlateNumber(plate_number, customer_id);
    }

    public async createNewCarDetail( plate_number:string,customer_id:string, carDetail_image:any, status:Boolean): Promise<CarDetail | ErrorHandler | null> {
        const carDetail = await this.carDetailRepository.findByPlateNumber (plate_number, customer_id);
        if (carDetail){ return new ErrorHandler('Auto Registrado',400);}
        else{
        return await this.carDetailRepository.createOne({ plate_number,customer_id,carDetail_image, status });}
    }

    public async updateOneCarDetail(_id: string,updated:object): Promise<CarDetail | null> {
        return await this.carDetailRepository.updateOne(_id,updated);
    }
    public async deleteOneCarDetail(_id: string): Promise<CarDetail | null> {
        return this.carDetailRepository.updateOne(_id, {status: false})
    }
    

}