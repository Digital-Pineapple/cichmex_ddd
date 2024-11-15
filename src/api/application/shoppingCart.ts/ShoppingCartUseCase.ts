import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { ShoppingCartRepository } from '../../domain/shoppingCart/shoppingCartRepository';
import { ShoppingCartEntity } from '../../domain/shoppingCart/shoppingCartEntity';
import { PopulateMembershipInSC, PopulateProductCS } from '../../../shared/domain/PopulateInterfaces';


export class ShoppingCartUseCase {
    protected path = '/shoppingCart'

    constructor(private readonly shoppingCartRepository:ShoppingCartRepository ) { }

    public async getShoppingCarts(): Promise<ShoppingCartEntity[] | ErrorHandler | null> {
        return await this.shoppingCartRepository.findAll()
    }
    public async getShoppingCartByUser(id: any): Promise<ShoppingCartEntity  | null> {
        return await this.shoppingCartRepository.findOneItem({user_id:id}, PopulateProductCS, PopulateMembershipInSC)
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
        
        
        return await this.shoppingCartRepository.updateOne(_id,{...updated});
    }
    public async deleteShoppingCart(_id: string): Promise<ShoppingCartEntity | null> {
        return await this.shoppingCartRepository.updateOne(_id, {status: true})
    }
    public async deletePInCart(item_id:any): Promise<ShoppingCartEntity | null> {
        return await this.shoppingCartRepository.DeletePinC(item_id)
    }

    public async getTotalCart(products: any): Promise<number> {
        const totalCart =  products?.reduce(
            (accumulator: number, currentValue: any) => {
                const discount = currentValue?.item?.porcentDiscount;
                const isDiscount = Boolean(discount);
                if(isDiscount){
                    const priceWithDiscount = currentValue?.item?.discountPrice;
                    return accumulator + Number(priceWithDiscount) * currentValue.quantity
                }
                return accumulator + Number(currentValue?.item?.price) * currentValue.quantity;
            }, 0);  
        return totalCart;        
    }
    public async getTotalWeight(products: any): Promise<number> {
        const weight = await products?.reduce((acc: number, product: any) => { 
            const currentWeight = Number(product?.item?.weight) || 0;                
            return acc + currentWeight * product.quantity
        }, 0);      
        return weight;
    }
}
    
