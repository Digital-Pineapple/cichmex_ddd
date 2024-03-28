import { ErrorHandler } from "../../../shared/domain/ErrorHandler";
import { ServicesInBranchEntity } from "../../domain/servicesInBranch/servicesInBranchEntity";
import { ServicesInBranchRepository } from "../../infrastructure/repository/servicesInBranch/ServicesInBranchRepository";

export class ServicesInBranchUseCase {
  constructor(
    private readonly servicesInBranchRepository: ServicesInBranchRepository
  ) {}

  public async getServicesInBranch(): Promise<
    ServicesInBranchEntity[] | ErrorHandler | null
  > {
    return await this.servicesInBranchRepository.findAll();
  }

  public async getDetailServiceInBranch(
    _id: string
  ): Promise<ServicesInBranchEntity | null> {
    return await this.servicesInBranchRepository.findById(_id);
  }

  public async getServicesInBranchByUser(
    _id: string
  ): Promise<ServicesInBranchEntity[] | ErrorHandler | null> {
    return await this.servicesInBranchRepository.findByUser(_id)
  }

  public async getServicesInBranchByBranch(
    _id: string
  ): Promise<ServicesInBranchEntity[] | ErrorHandler | null> {
    return await this.servicesInBranchRepository.findAllItems({branch_id:_id, deleted:false})
  }

  public async createServiceInBranch(
    body:any

  ): Promise<ServicesInBranchEntity | ErrorHandler | null> {
    const response = await this.servicesInBranchRepository.
    findOneItem({user_id:body.user_id,service_id:body.service_id, })
    if (response) {
      return new ErrorHandler("Servicio existente en sucursal", 400);
    } else {
      return await this.servicesInBranchRepository.createOne({
        user_id: body.user_id,
        service_id: body.service_id,
        typeCar_id: body.typeCar_id,
        price: body.price,
        description: body.price,
        branch_id: body.branch_id
      });
    }
  }

  public async updateServiceInBranch(
    _id: string,
    updated: ServicesInBranchEntity
  ): Promise<ServicesInBranchEntity | null> {
    return await this.servicesInBranchRepository.updateOne(_id, updated);
  }

 
  public async deleteServiceInBranch(
    _id: string,
  ): Promise<ServicesInBranchEntity | null | ErrorHandler> {
    
    return await this.servicesInBranchRepository.updateOne(_id,{deleted: true})
  }
}
