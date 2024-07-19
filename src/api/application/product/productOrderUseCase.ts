import { ErrorHandler } from "../../../shared/domain/ErrorHandler";
import { InfoBranchOrder } from "../../../shared/domain/PopulateInterfaces";
import { RandomCodeId } from "../../../shared/infrastructure/validation/Utils";
import {  ProductOrderEntity, ProductOrderResume } from "../../domain/product/ProductEntity";
import { ProductOrderRepository } from "../../domain/product/ProductOrderRepository";


export class ProductOrderUseCase {
  constructor(private readonly productOrderRepository: ProductOrderRepository) {}

  public async getProductOrders(): Promise<ProductOrderEntity[] | ErrorHandler | null> {
    return await this.productOrderRepository.findAllProductOrders(InfoBranchOrder)
  }
  public async getProductOrdersResume(): Promise<ProductOrderResume> {
    return await this.productOrderRepository.ResumeProductOrders()
  }

  public async getOneProductOrder( _id: string): Promise<ProductOrderEntity | ErrorHandler| null > {
    const response =  await this.productOrderRepository.findById(_id, InfoBranchOrder)
    return response
  }
  public async ProductOrdersByBranch( _id: string): Promise<ProductOrderEntity[] | ErrorHandler| null > {
    const response =  await this.productOrderRepository.getProductOrdersByBranch(_id)
    return response
  }
  public async ProductOrdersByUser( _id: string): Promise<ProductOrderEntity[] | ErrorHandler| null > {
    const response =  await this.productOrderRepository.getProductOrdersByUser(_id, InfoBranchOrder)
    return response
  }

  public async createProductOrder(body:any): Promise<ProductOrderEntity | ErrorHandler | null> {
    const order_id = RandomCodeId('CIC')
    return await this.productOrderRepository.createOne({...body, order_id})
  }

  public async updateProductOrder(
    _id: string,
    updated: any
  ): Promise<ProductOrderEntity> {
    
    return await this.productOrderRepository.updateOne(_id, updated);
  }

  public async startFillProductOrder(
    _id: string,
    updated: any
  ): Promise<ProductOrderEntity> {
    
    return await this.productOrderRepository.updateOne(_id, updated);
    
  }
  
  public async deleteProductOrder(_id: string): Promise<ProductOrderEntity| ErrorHandler | null> {
    return this.productOrderRepository.updateOne(_id, { status: false });
  }
}
