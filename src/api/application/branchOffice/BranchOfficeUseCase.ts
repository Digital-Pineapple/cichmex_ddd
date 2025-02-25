import mongoose from "mongoose";
import { ErrorHandler } from "../../../shared/domain/ErrorHandler";
import { BranchPopulateConfig } from "../../../shared/domain/PopulateInterfaces";
import { BranchOfficeEntity, BranchOfficeResponse, ILocation } from "../../domain/branch_office/BranchOfficeEntity";
import { BranchOfficeRepository } from "../../domain/branch_office/BranchOfficeRepository";


export class BranchOfficeUseCase {
  constructor(
    private readonly branchOfficeRepository: BranchOfficeRepository
  ) { }

  public async getCichmexBranches(): Promise<BranchOfficeEntity[] | null> {
    return await this.branchOfficeRepository.getCichmexBranches();    
  }

  public async getAllBranchOffices(): Promise<
    BranchOfficeEntity[] | ErrorHandler | null
  > {
    return await this.branchOfficeRepository.findAll();
  }

  public async getInfoBranchOffices(): Promise<BranchOfficeEntity[] | BranchOfficeResponse[] | null> {
   let data : any  =  await this.branchOfficeRepository.getInfoBranches({activated:true}) 
   
   const info = ()=>{

     const a : BranchOfficeEntity[] = data?.map((item:any)=>{
      let b = {
      _id: item?._id,
      name: item?.name,
      description: item?.description,
      phone_number: item?.phone_number || '',
       }
       return b
    })
    return a

   }

   return info()
}



  public async getDetailBranchOffice(
    _id: string
  ): Promise<BranchOfficeEntity | null> {
    return await this.branchOfficeRepository.findByIdPupulate(_id, BranchPopulateConfig);
  }

  public async getBranchesUser(
    _id: string
  ): Promise<BranchOfficeEntity[] | null> {
    return await this.branchOfficeRepository.findByUser(_id)
  }


  public async createBranchOffice(
    body: any, location :object
  ): Promise<BranchOfficeEntity | ErrorHandler> {
    const newBranch = {
      ...body,
      location
    }
    const noRepeat = await this.branchOfficeRepository.findOneItem({ name: newBranch.name, status:true })
    if (noRepeat) {
      return new ErrorHandler('Esta sucursal ya existe', 401)
    }
    return await this.branchOfficeRepository.createOne({ ...newBranch });
  }

  public async updateBranchOffice(
    _id: string,
    updated: any
  ): Promise<BranchOfficeEntity | ILocation | null> {
    // const Branch = {
    //   ...updated,
    //   location: JSON.parse(updated.location)
    // }
    
    return await this.branchOfficeRepository.updateOne(_id, {...updated});
  }


  public async deleteOneBranchOffice(
    _id: string
  ): Promise<BranchOfficeEntity | ErrorHandler | null> {
    const {activated} = await this.branchOfficeRepository.findById(_id)
    if (activated === true) return new ErrorHandler('La sucursal se encuentra activa',400)
    return this.branchOfficeRepository.updateOne(_id, { status: false });

  }
  public async validateBranchOffice(
    _id: string,
    object: any
  ): Promise<BranchOfficeEntity | null> {
    return this.branchOfficeRepository.updateOne(_id, { ...object });
  }

  public async getCloserBranches(coords : { lat: number, lng: number }): Promise<BranchOfficeEntity[] | null> {
    const branches = await this.branchOfficeRepository.findCloserBranches(coords);
    return branches;    
  }
}
