import { ErrorHandler } from "../../../shared/domain/ErrorHandler";
import { InfoAddressOrder, InfoBranchOrder, PopulateBranch, PopulateInfoUser, PopulatePayment } from "../../../shared/domain/PopulateInterfaces";
import { MomentService } from "../../../shared/infrastructure/moment/MomentService";
import { RandomCodeId } from "../../../shared/infrastructure/validation/Utils";
import {  ProductOrderEntity, ProductOrderResume, SupplyOneProduct } from "../../domain/product/ProductEntity";
import { ProductOrderRepository } from "../../domain/product/ProductOrderRepository";
import { locationProductRepository } from "../../domain/warehouse/locationProductRepository";


export class ProductOrderUseCase {
  constructor(private readonly productOrderRepository: ProductOrderRepository, private readonly locationRepository: locationProductRepository) {}

  public async getProductOrders(): Promise<ProductOrderEntity[] | ErrorHandler | null> {
    return await this.productOrderRepository.findAllProductOrders(InfoBranchOrder, PopulatePayment, PopulateInfoUser, InfoAddressOrder)
  }
  public async getProductOrdersExpired(): Promise<ProductOrderEntity[] | ErrorHandler | null> {
    return await this.productOrderRepository.getPOExpired()
  }
  public async getProductOrdersResume(): Promise<ProductOrderResume> {
    return await this.productOrderRepository.ResumeProductOrders()
  }
  public async getOnePO(body:any): Promise<ProductOrderEntity> {
    
    return await this.productOrderRepository.findOneItem({...body}, InfoBranchOrder)
  }

  public async getOneProductOrder( _id: string): Promise<ProductOrderEntity | ErrorHandler| null > {
    const response =  await this.productOrderRepository.findById(_id, InfoBranchOrder, PopulateInfoUser, PopulatePayment, InfoAddressOrder)
    return response
  }
  public async getPOAndLocations( _id: string): Promise<ProductOrderEntity | ErrorHandler| null > {
    return await this.productOrderRepository.findOneItem({ _id }, InfoBranchOrder, PopulateInfoUser, PopulatePayment)
  }
  public async getPOSupply( _id: string): Promise<ProductOrderEntity | null > {
    return  await this.productOrderRepository.getPOforSupply(_id)
  }
  public async ProductOrdersByBranch( _id: string): Promise<ProductOrderEntity[] | ErrorHandler| null > {
    const response =  await this.productOrderRepository.getProductOrdersByBranch(_id, PopulateInfoUser)
    return response
  }
  public async ordersByBranchDelivered( _id: any): Promise<ProductOrderEntity[] | ErrorHandler| null > {
    return await this.productOrderRepository.findAllItems({branch:_id, order_status: 8 }, InfoBranchOrder, PopulateInfoUser)
  }
  public async ProductOrdersPaid(): Promise<ProductOrderEntity[] | ErrorHandler| null > {
    const response =  await this.productOrderRepository.getPaidProductOrders()
    return response
  }
  public async ProductOrdersPaidAndFill(): Promise<ProductOrderEntity[] | ErrorHandler| null > {
    const response =  await this.productOrderRepository.findAllItems({payment_status: 'approved',storeHouseStatus:true},InfoBranchOrder, PopulateInfoUser, PopulatePayment, InfoAddressOrder )
    return response
  }
  public async PendingTransferPO(): Promise<ProductOrderEntity[] | ErrorHandler| null > {
    const response =  await this.productOrderRepository.getPendingTransferPO()
    return response
  }
  public async POGetAssigned(): Promise<ProductOrderEntity[] | ErrorHandler| null > {
    const response =  await this.productOrderRepository.getAssignedPO()
    return response
  }
  public async POGetAssignedUser(user_id:any): Promise<ProductOrderEntity[] | ErrorHandler| null > {
    const response =  await this.productOrderRepository.getAssignedPOUser(user_id)
    return response
  }
  public async POPaidAndSupplyToPoint(): Promise<ProductOrderEntity[] | ErrorHandler| null > {
    const response =  await this.productOrderRepository.getPaidAndSuplyToPointPO()
    return response
  }
  public async POReadyToRoute(user_id: any): Promise<ProductOrderEntity[] | ErrorHandler| null > {
    const response =  await this.productOrderRepository.getPaidAndVerifyPackageToPointPO(user_id)
    return response
  }
  public async PODeliveries(): Promise<ProductOrderEntity[] | ErrorHandler| null > {
    const response =  await this.productOrderRepository.getDeliveriesPO()
    return response
  }

  public async POPickedUp(): Promise<ProductOrderEntity[] | ErrorHandler| null > {
    const response =  await this.productOrderRepository.getPaidAndSuplyToPointPO()
    return response
  }
  public async ProductOrdersByUser( _id: string): Promise<ProductOrderEntity[] | ErrorHandler| null > {
    const response =  await this.productOrderRepository.getProductOrdersByUser(_id, InfoBranchOrder, InfoAddressOrder)
    return response
  }

  public async createProductOrder(body:any): Promise<ProductOrderEntity | ErrorHandler | null> {
    return await this.productOrderRepository.createOne({...body})
  }

  public async findPOReadyToDelivery(user_id:any): Promise<ProductOrderEntity[] | null> {
    return await this.productOrderRepository.findAllItems({route_status: true, order_status: 5, 'route_detail.user':user_id}, PopulateBranch)
  }

  public async updateProductOrder(
    _id: any,
    updated: any
  ): Promise<ProductOrderEntity> {
    
    return await this.productOrderRepository.updateOne(_id, updated);
  }

  public async startFillProductOrder(
    _id: string,
    updated: any
  ): Promise<ProductOrderEntity> {
    
    
    return await this.productOrderRepository.updateOne(_id, {...updated});
    
  }
  
  public async deleteProductOrder(_id: string): Promise<ProductOrderEntity| ErrorHandler | null> {
    return this.productOrderRepository.updateOne(_id, { status: false });
  }
  public async supplyData(_id: string, userInfo: any): Promise<SupplyOneProduct[] | ErrorHandler | null> {
    const date = new Date();
    const ProductOrder = await this.productOrderRepository.findOneItem({ _id });
    if (!ProductOrder) {
      return new ErrorHandler('No se encontró orden', 500);
    }
  
    if (ProductOrder.order_status === 3) {
      return new ErrorHandler('Esta orden ya está surtida', 500);
    }
  
    // Validación de ubicaciones antes de continuar
    for (const product of ProductOrder.products) {
      const location = await this.locationRepository.findOneItem({
        product: product.item._id,
        variant: product.variant?._id ? product.variant._id: null,
      });
  
      if (!location) {
        return new ErrorHandler(
          `No se encontró ubicación para el producto ${product.item.name} con variante ${product.variant.attributes.color}-${product.variant.attributes.size}`,
          500
        );
      }
    }
  
    // Generación y retorno del detalle de surtido
    const fillData: SupplyOneProduct[] = await Promise.all(
      ProductOrder.products.map(async (product: any) => {
        const location = await this.locationRepository.findOneItem({
          product: product.item._id,
          variant: product.variant?._id ? product.variant._id: null,
        });
  
        const quantity = product.quantity;
        const newQuantity = location.quantity - quantity;
  
        await this.locationRepository.updateOne(location._id, { quantity: newQuantity });
  
        return {
          product_id: product.item._id,
          variant_id: product.variant?._id ? product.variant._id: null,
          status: true,
          location: location._id,
          quantity,
          type: product.variant?._id ? 'variant_product' : 'unique_product',
          user: userInfo,
          date,
        };
      })
    );
  
    return fillData;
  }
  
}
