import { MongoRepository } from '../MongoRepository';
import { BannerRepository as BannerConfig } from '../../../domain/banners/BannerRespository';
import { Model } from 'mongoose';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { BannerEntity } from '../../../domain/banners/BannerEntity';



export class BannerRepository extends MongoRepository implements BannerConfig {
    

    constructor(protected BannerModel: Model<any>) {
        super(BannerModel);
    }

    async getBanners(): Promise<BannerEntity[] | ErrorHandler| null> {
        return await this.findAll()

    }
    async findOneBanner(_id: string): Promise<BannerEntity | null> {
        return await this.findOneItem({_id: _id});
    }

}