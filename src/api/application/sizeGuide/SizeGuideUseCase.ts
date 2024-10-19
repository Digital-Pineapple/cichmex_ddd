import { RegionEntity } from "../../domain/regions/RegionEntity";
import { SizeGuideEntity } from "../../domain/sizeGuide/SizeGuideEntity";
import { SizeGuideRepository } from "../../domain/sizeGuide/SizeGuideRepository";


export class SizeGuideUseCase {
  constructor(private readonly sizeGuideRepository: SizeGuideRepository) {}

  public async getAllMyGuides(id : string): Promise<SizeGuideEntity[]> {
    return await this.sizeGuideRepository.findByUser(id)
  }
  public async getOneGuide(id : string): Promise<SizeGuideEntity> {
    return await this.sizeGuideRepository.findById(id)
  }
  public async createOneGuide( body : object): Promise<SizeGuideEntity> {
    return await this.sizeGuideRepository.createOne({...body})
  }
  public async updateOneGuide( id: string, body : object): Promise<SizeGuideEntity> {
    return await this.sizeGuideRepository.updateOne(id,{...body})
  }
  public async deleteOneGuide( id: string): Promise<SizeGuideEntity> {
    return await this.sizeGuideRepository.updateOne(id,{status:false})
  }

}
