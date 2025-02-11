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
    public async getActiveAndOrderBanners(): Promise<BannerEntity[]  | null>  {
        return await this.BannerModel.find({status: true, is_active : true}).sort({ no_slide: 1 }).select('-is_active -status -createdAt -updatedAt -_id')
    }

}