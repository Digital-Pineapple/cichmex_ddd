import mongoose from "mongoose";
import { ErrorHandler } from "../../../shared/domain/ErrorHandler";
import { RegionEntity } from "../../domain/regions/RegionEntity";
import { SizeGuideEntity } from "../../domain/sizeGuide/SizeGuideEntity";
import { SizeGuideRepository } from "../../domain/sizeGuide/SizeGuideRepository";


export class SizeGuideUseCase {
  constructor(private readonly sizeGuideRepository: SizeGuideRepository) {}

  public async getAllGuides(): Promise<SizeGuideEntity[]> {
    return await this.sizeGuideRepository.findAll()
  }
  public async getAllMyGuides(id : string): Promise<SizeGuideEntity[]> {
    return await this.sizeGuideRepository.findByUser(id)
  }
  public async getOneGuide(id : string): Promise<SizeGuideEntity> {
    return await this.sizeGuideRepository.findById(id)
  }
  public async createOneGuide( body : any): Promise<SizeGuideEntity | ErrorHandler> {
    const noRepeat = await this.sizeGuideRepository.findOneItem({name: body.name, status:true})
    if (noRepeat) {
      return new ErrorHandler(`La guía con el nombre : "${body.name}" ya se encuentra en uso`, 500)
    }
    return await this.sizeGuideRepository.createOne({...body})
  }
  public async updateOneGuide(id: string, body: any): Promise<SizeGuideEntity | ErrorHandler> {
    const noRepeat = await this.sizeGuideRepository.findOneItem({ name: body.name, status: true });
    const objectID = new mongoose.Types.ObjectId(id);
    if (noRepeat && !noRepeat._id.equals(objectID) && noRepeat.name === body.name) {
        return new ErrorHandler(`La guía con el nombre: "${body.name}" ya se encuentra en uso`, 500);
    }

    // Realizamos la actualización
    return await this.sizeGuideRepository.updateOne(id, { ...body });
}

  public async deleteOneGuide( id: string): Promise<SizeGuideEntity> {
    return await this.sizeGuideRepository.updateOne(id,{status:false})
  }

}
