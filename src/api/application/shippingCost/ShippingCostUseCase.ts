import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { IShoppingCostResponse, ShippingCostEntity } from '../../domain/shippingCost/ShippingCostEntity';
import { ShippingCostRepository } from '../../domain/shippingCost/ShippingCostRepository';

export class ShippingCostUseCase {
    protected path = '/shoppingCart'

    constructor(private readonly shippingCostRepository:ShippingCostRepository ) { }

    public async getShippingCosts(): Promise<ShippingCostEntity[] | ErrorHandler | null> {
        return await this.shippingCostRepository.findAll()
    }
    public async getShippingCost(id: any): Promise<ShippingCostEntity  | null> {
        return await this.shippingCostRepository.findById(id)
    }
    public async createShoppingCost(body:any): Promise<ShippingCostEntity | null> {
        return await this.shippingCostRepository.createOne({...body})
    
    }
    public async updateShippingCost(_id: string,updated: object): Promise<ShippingCostEntity  | null> {
        return await this.shippingCostRepository.updateOne(_id,{...updated});
    }
    public async deleteShippingCost(_id: string): Promise<ShippingCostEntity | null> {
        return await this.shippingCostRepository.updateOne(_id, {status: false})
    }
    public async findShippingCost(weight:any): Promise<ShippingCostEntity | IShoppingCostResponse |  null>{
        return await this.shippingCostRepository.findShippingCostByWeight(weight)
        

    }
}
    
