import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { StockStoreHouseRepository } from '../../domain/storehouse/stockStoreHouseRepository';
import { StockStoreHouseEntity } from '../../domain/storehouse/stockStoreHouseEntity';
import { getProperties } from '../../../helpers/products';


export class StockStoreHouseUseCase {
    protected path = '/stock-store-house'
    readonly storeHouseId = '662fe69b9ba1d8b3cfcd3634';

    constructor(private readonly stockStoreHouseRepository: StockStoreHouseRepository) { }

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

    public async validateProductsStock(products: any): Promise<any> {
        await Promise.all(
            products.map(async (product: any) => {
                let available;                    
                const isVariant = Boolean(product?.variant ?? null);
                let name = product.item.name;                     
                if(isVariant){
                   available = await this.getVariantStock(product.variant._id)                           
                   name = name + getProperties(product.variant.attributes)
                }else{
                    available = await this.getProductStockPayment(product.item._id);                          
                }
                if (!available) {
                    throw new ErrorHandler(`Sin existencias del producto: ${name}`, 500)                    
                }
            })
        );
        
    }
    
    



}

