import { StockSHReturnRepository } from './../../domain/storehouse/stockStoreHouseRepository';
import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { StockStoreHouseRepository } from '../../domain/storehouse/stockStoreHouseRepository';
import { SHProductReturn, StockStoreHouseEntity } from '../../domain/storehouse/stockStoreHouseEntity';
import { getProperties } from '../../../helpers/products';
import { log } from 'console';
import { UserEntity } from '../../domain/user/UserEntity';
import { ProductEntity } from '../../domain/product/ProductEntity';
import { product } from '../../../../swaggerdocs';


export class StockStoreHouseUseCase {
    protected path = '/stock-store-house'
    readonly storeHouseId = '662fe69b9ba1d8b3cfcd3634';

    constructor(private readonly stockStoreHouseRepository: StockStoreHouseRepository,
        private readonly  stockSHReturnRepository :StockSHReturnRepository

    ) { }

    public async getStock(id:any): Promise<StockStoreHouseEntity[] | ErrorHandler | null> {
        return await this.stockStoreHouseRepository.findStockByStoreHouse(id);
    }

    public async dailyFeed(id:any): Promise<StockStoreHouseEntity[] | ErrorHandler | null> {
        return await this.stockStoreHouseRepository.dailyFeedStocks(id)
    }
    public async getStockNoDetail(id:any): Promise<any> {
        return await this.stockStoreHouseRepository.findStockByStoreHouseNoDetail(id);
    }
    
    public async getProductStock(product_id: any,StoreHouse_id?:any, populateConfig?:any,   ) : Promise <StockStoreHouseEntity > { 
          return await this.stockStoreHouseRepository.findOneItem({product_id: product_id, StoreHouse_id:StoreHouse_id, status:true}) 
    }
    public async getVariantStock(variant_id: string,StoreHouse_id?:any , populateConfig?:any,   ) : Promise <StockStoreHouseEntity > { 
        return await this.stockStoreHouseRepository.findOneItem({variant_id: variant_id, StoreHouse_id: StoreHouse_id ?? this.storeHouseId, status:true}) 
  }
     
    public async getProductStockPayment(product_id: string,StoreHouse_id?:any, populateConfig?:any,   ) : Promise <StockStoreHouseEntity > { 
        return await this.stockStoreHouseRepository.findOneItem({product_id: product_id, StoreHouse_id: this.storeHouseId, status:true}) 
  } 

    public async getDetailStock(_id: string): Promise<StockStoreHouseEntity | null> {
        return await this.stockStoreHouseRepository.findById(_id);
    }

    public async createStock(body:object): Promise<StockStoreHouseEntity | null> {
        return this.stockStoreHouseRepository.createOne({...body})
    }
    public async updateStock(_id: any,updated: object): Promise<StockStoreHouseEntity  | null> {
        return await this.stockStoreHouseRepository.updateOne(_id,updated);
    }
    public async deleteStock(_id: string): Promise<StockStoreHouseEntity | null> {
        return this.stockStoreHouseRepository.updateOne(_id, {status: false, stock:0 })
    }
    public async getAllProductsEntries(): Promise<StockStoreHouseEntity[]| null> {
        return this.stockStoreHouseRepository.findAllInputs()
    }
    public async getAllProductOutputs(): Promise<StockStoreHouseEntity[]| null> {
        return this.stockStoreHouseRepository.findAllOutputs()
    }
    public async createReturn(folio: string, order_id: string,stock:any, responsible:Object, productDetail: ProductEntity, reason: string, quantity : number ): Promise<SHProductReturn| null> {
        
        const ret = await this.stockSHReturnRepository.createOne({
            SHStock_id: stock._id,
            quantity: quantity,
            newQuantity: stock.stock + quantity,
            responsible_id: responsible,
            product_detail: productDetail,
            reason: reason,
            order_id: order_id,
            folio: folio,
            status: true,
        })
        if(!ret) {
            throw new ErrorHandler('No se pudo crear el retorno', 404);
        }
        const updatedStock = await this.stockStoreHouseRepository.updateOne(stock._id, {
            stock: stock.stock + quantity,
            status: true,
        })
        if(!updatedStock) {
            throw new ErrorHandler('No se pudo actualizar el stock', 404);
        }
        return ret;
    }

    public async validateProductsStock(products: any): Promise<void> {
          await Promise.all(
            products.map(async (product: any) => {
              const isVariant = Boolean(product.variant);
              let stockInfo: any;
              
              if (isVariant && product.variant) {
                stockInfo = await this.getVariantStock(product.variant, this.storeHouseId);
              } else {
                stockInfo = await this.getProductStock(product._id, this.storeHouseId);
              }
              console.log(product);
              
              if (!stockInfo) {
                throw new ErrorHandler(`El producto ${product.name} no tiene stock`, 404);
              }
              
              const availableStock = stockInfo.stock || 0;
              if (availableStock < product.quantity) {
                throw new ErrorHandler(`Lo sentimos, el producto ${product.item.name} 
                    ${ product.variant? product.variant.attributes.size: null} 
                    ${product.variant? product.variant.attributes.color: null} 
                    no tiene suficiente stock`, 404);
              }
            })
          );
       
    
    }



}

