import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { ShoppingCartRepository } from '../../domain/shoppingCart/shoppingCartRepository';
import { ShoppingCartEntity } from '../../domain/shoppingCart/shoppingCartEntity';


export class ShoppingCartUseCase {
    protected path = '/shoppingCart'

    constructor(private readonly shoppingCartRepository:ShoppingCartRepository ) { }

    public async getShoppingCarts(): Promise<ShoppingCartEntity[] | ErrorHandler | null> {
        return await this.shoppingCartRepository.findAll()
    }
    public async getShoppingCartByUser(id : any): Promise<ShoppingCartEntity | ErrorHandler | null> {
        return await this.shoppingCartRepository.findOneItem({user_id:id})
    }
    public async createShoppingCart(body:any): Promise<ShoppingCartEntity | null> {
        
        const noRepeat = await this.shoppingCartRepository.findOneItem({user_id:body.user_id})
        if (noRepeat !== null) {
          const resp = await this.shoppingCartRepository.updateOne(noRepeat._id,{memberships:body.memberships, products: body.products})
          return resp
          }else{
        return await this.shoppingCartRepository.createOne({...body})
    }
    }
    public async updateShoppingCart(_id: string,updated: object): Promise<ShoppingCartEntity  | null> {
        return await this.shoppingCartRepository.updateOne(_id,updated);
    }
    public async deleteShoppingCart(_id: string): Promise<ShoppingCartEntity | null> {
        return await this.shoppingCartRepository.updateOne(_id, {deleted: true})
    }
}
    
