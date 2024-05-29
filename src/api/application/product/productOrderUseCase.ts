import { ErrorHandler } from "../../../shared/domain/ErrorHandler";
import { InfoBranchOrder } from "../../../shared/domain/PopulateInterfaces";
import {  ProductOrderEntity } from "../../domain/product/ProductEntity";
import { ProductOrderRepository } from "../../domain/product/ProductOrderRepository";


export class ProductOrderUseCase {
  constructor(private readonly productOrderRepository: ProductOrderRepository) {}

  public async getProductOrders(): Promise<ProductOrderEntity[] | ErrorHandler | null> {
    return await this.productOrderRepository.findAll()
  }

  public async getOneProductOrder( _id: string): Promise<ProductOrderEntity | ErrorHandler| null > {
    const response =  await this.productOrderRepository.findById(_id)
    return response
  }
  public async ProductOrdersByUser( _id: string): Promise<ProductOrderEntity[] | ErrorHandler| null > {
    const response =  await this.productOrderRepository.getProductOrdersByUser(_id, InfoBranchOrder)
    return response
  }

  public async createProductOrder(body:any): Promise<ProductOrderEntity | ErrorHandler | null> {
    return await this.productOrderRepository.createOne({...body})
  }

  public async updateProductOrder(
    _id: string,
    updated: any
  ): Promise<ProductOrderEntity> {
    
    return await this.productOrderRepository.updateOne(_id, updated);
  }
  
  public async deleteProductOrder(_id: string): Promise<ProductOrderEntity| ErrorHandler | null> {
    return this.productOrderRepository.updateOne(_id, { status: false });
  }
}
