import { MongoRepository } from "../../infrastructure/repository/MongoRepository"
import { BannerEntity } from "./BannerEntity"



export interface BannerRepository extends MongoRepository {

    getActiveAndOrderBanners(): Promise<BannerEntity[]  | null> 
    
}