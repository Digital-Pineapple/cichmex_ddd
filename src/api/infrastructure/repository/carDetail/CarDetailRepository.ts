import { Model } from 'mongoose';
import { CarDetailRepository as CarDetailConfig } from '../../../domain/carDetail/CarDetailRepository'
import { MongoRepository } from '../MongoRepository';
import { CarDetail } from '../../../domain/carDetail/CarDetailEntity';



export class CategoryRepository extends MongoRepository implements CarDetailConfig {
    

    constructor(protected CarDetailModel: Model<any>) {
        super(CarDetailModel);
    }

    async findOneCarDetail(query: Object): Promise<CarDetail | null> {
        return await this.findOneItem(query);
    }

    async findByIdCarDetail(_id: String): Promise<CarDetail | null> {
        return await this.findById(_id);
    }
    async findAndUpdateCarDetail(_id: String, updated: object): Promise<CarDetail | null> {
        return await this.updateOne(_id, updated);
    }
    
    async findAllCarDetails(): Promise<CarDetail[] | null> {
        return await this.findAll();
    }

    async createOneCarDetail(body: Object): Promise<CarDetail | null> {
        return await this.createOne(body);
    }
   

}