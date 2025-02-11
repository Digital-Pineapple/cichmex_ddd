import { BannerRepository } from '../../domain/banners/BannerRespository';
import { BannerEntity } from '../../domain/banners/BannerEntity';
import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import mongoose from 'mongoose';
import { PopulateBanner } from '../../../shared/domain/PopulateInterfaces';


export class BannerUseCase {

    constructor(private readonly bannerRepository: BannerRepository) { }

    public async getBanners(): Promise<BannerEntity[]  | null> {
        return await this.bannerRepository.findAll()
    }
    public async getOneBanner(id: string): Promise<BannerEntity  | null> {
        return await this.bannerRepository.findByIdPupulate(id, PopulateBanner)
    }
    public async createBanner(body: BannerEntity): Promise<BannerEntity | ErrorHandler | null> {
        const noRepeat =  await this.bannerRepository.findOneItem({no_slide : body.no_slide, status: true})
        if (noRepeat) {
            return new ErrorHandler('Ya existe un banner en esta posicion',400)
        }
        return await this.bannerRepository.createOne({...body})
    }
    public async updateBanner(id: any, updated: BannerEntity): Promise<BannerEntity | ErrorHandler | null> {
        const noRepeat =  await this.bannerRepository.findOneItem({no_slide : updated.no_slide, status: true})
        const objectID = new mongoose.Types.ObjectId(id);
            if (noRepeat && !noRepeat._id.equals(objectID) && noRepeat.no_slide === updated.no_slide) {
                return new ErrorHandler(`El slide No.: "${updated.no_slide}" ya se encuentra en uso`, 500);
            }
        return await this.bannerRepository.updateOne(id,{...updated})
    }
    public async deleteBanner(id: string): Promise<BannerEntity  | null> {
        return await this.bannerRepository.updateOne(id,{status: false})
    }
    public async getActiveBanners(): Promise<BannerEntity[]  | null> {
        return await this.bannerRepository.findAllItems({status: true, is_active: true})
    }

}