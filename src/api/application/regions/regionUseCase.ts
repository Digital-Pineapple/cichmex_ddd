import { RegionEntity } from "../../domain/regions/RegionEntity";
import { RegionRepository } from "../../domain/regions/RegionRepository";


export class RegionUseCase {
  constructor(private readonly regionRepository: RegionRepository) {}

  public async getAllRegions(): Promise<RegionEntity[]> {
    return await this.regionRepository.findAll()
  }

  public async getOneRegion(_id: string): Promise<RegionEntity | null > {
    return await this.regionRepository.findById(_id)
  }
  public async createRegion(body: RegionEntity): Promise<RegionEntity | null > {
    return  await this.regionRepository.createOne({...body})
  }

  public async updateRegion( _id: string,updated: any): Promise<RegionEntity> {
    return await this.regionRepository.updateOne(_id, {...updated});
  }
  
  public async deleteRegion(_id: string): Promise<RegionEntity | null> {
    return this.regionRepository.updateOne(_id, { status: false });
  }

}
