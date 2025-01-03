import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { ShoppingCartRepository } from '../../domain/shoppingCart/shoppingCartRepository';
import { ShoppingCartEntity } from '../../domain/shoppingCart/shoppingCartEntity';
import { PopulateMembershipInSC, PopulateProductCS, PopulateVariantProduct } from '../../../shared/domain/PopulateInterfaces';


export class ShoppingCartUseCase {
    protected path = '/shoppingCart'

    constructor(private readonly shoppingCartRepository:ShoppingCartRepository ) { }

    public async getShoppingCarts(): Promise<ShoppingCartEntity[] | ErrorHandler | null> {
        return await this.shoppingCartRepository.findAll()
    }
    public async getShoppingCartByUser(id: any): Promise<ShoppingCartEntity  | null> {
        let cart = await this.shoppingCartRepository.findOneItem({user_id:id}, PopulateProductCS, PopulateVariantProduct, PopulateMembershipInSC)        
        if(!cart){
            return null
        }
        let products = cart?.products;
        const existsNullableProduct = products?.map((product: any) => product.item).some((item: any) => item === null)
        if(existsNullableProduct){
            const noNullableProducts = products?.filter((product: any) => product.item !== null)
            await this.shoppingCartRepository.updateOne(cart._id,{products: noNullableProducts})
            cart = await this.shoppingCartRepository.findOneItem({user_id:id}, PopulateProductCS, PopulateMembershipInSC)     
        }
        return cart;
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
                const variant = currentValue?.variant;
                const product = currentValue?.item;
                const isVariant = Boolean(variant);
                if(isVariant){
                    const discount = variant?.porcentDiscount ?? null;
                    const isDiscount = Boolean(discount);
                    if(isDiscount){
                        const priceWithDiscount = variant?.discountPrice;
                        return accumulator + Number(priceWithDiscount) * currentValue.quantity
                    }
                    return accumulator + Number(variant?.price) * currentValue.quantity;
                }else{
                    const discount = product?.porcentDiscount ?? null;
                    const isDiscount = Boolean(discount);
                    if(isDiscount){
                        const priceWithDiscount = product.discountPrice;
                        return accumulator + Number(priceWithDiscount) * currentValue.quantity
                    }
                    return accumulator + Number(product?.price) * currentValue.quantity;
                }
            }, 
            0);  
        return totalCart;        
    }

    public async getTotalWeight(products: any): Promise<number> {
        const weight = await products?.reduce((acc: number, product: any) => { 
            const variant = product?.variant;
            const main= product?.item;
            const isVariant = Boolean(variant);
            let currentWeight = isVariant ? Number(variant?.weight) || 0 : Number(main?.weight) || 0;                                
            const total = acc + (currentWeight * product.quantity)
            //  console.log("the total is"+ total);                                                    
            return total
        }, 0);      
        return weight;
    }
}
    
