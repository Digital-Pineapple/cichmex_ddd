import { ProductUseCase } from './../../../application/product/productUseCase';
import { StockStoreHouseUseCase } from './../../../application/storehouse/stockStoreHouseUseCase';
import { body } from 'express-validator';
import { ObjectId } from 'mongodb';
import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { PaymentUseCase } from '../../../application/payment/paymentUseCase';
import { stringify } from 'uuid';
import { MPService } from '../../../../shared/infrastructure/mercadopago/MPService';
import { ShoppingCartUseCase } from '../../../application/shoppingCart.ts/ShoppingCartUseCase';
import { ProductShopping } from '../../../domain/product/ProductEntity';
import mongoose from 'mongoose';
import { ShoppingCartEntity } from '../../../domain/shoppingCart/shoppingCartEntity';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { ShippingCostUseCase } from '../../../application/shippingCost/ShippingCostUseCase';
import { VariantProductUseCase } from '../../../application/variantProduct/VariantProductUseCase';

export class ShoppingCartController extends ResponseData {
    protected path = '/shoppingCart'
    private readonly onlineStoreHouse = "662fe69b9ba1d8b3cfcd3634"

    constructor(
        private shoppingCartUseCase: ShoppingCartUseCase,
        private stockStoreHouseUseCase: StockStoreHouseUseCase,
        private shippingCostUseCase: ShippingCostUseCase,
        private productUseCase: ProductUseCase,
        private variantProductUseCase: VariantProductUseCase,
        private readonly s3Service: S3Service
    ) {
        super();
        this.getAllShoppingCarts = this.getAllShoppingCarts.bind(this);
        this.getShoppingCart = this.getShoppingCart.bind(this);
        // this.createShoppingCart = this.createShoppingCart.bind(this);
        // this.updateShoppingCart = this.updateShoppingCart.bind(this);
        this.deleteShoppingCart = this.deleteShoppingCart.bind(this);
        // this.deleteMembershipInCart = this.deleteMembershipInCart.bind(this)
        this.deleteProductCart = this.deleteProductCart.bind(this)
        this.emptyCart = this.emptyCart.bind(this)
        this.addToCart = this.addToCart.bind(this);
        this.updateProductQuantity = this.updateProductQuantity.bind(this);
        this.replaceProductQuantity = this.replaceProductQuantity.bind(this);
        this.mergeCart = this.mergeCart.bind(this);
        this.noAuthCart = this.noAuthCart.bind(this);
    }

    public async getAllShoppingCarts(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.shoppingCartUseCase.getShoppingCarts();
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getShoppingCart(req: Request, res: Response, next: NextFunction) {
        const user = req.user;
        try {                                    
            const response: any | null = await this.shoppingCartUseCase.getShoppingCartByUser(user._id+"");
            if(!response) return next(new ErrorHandler('No existe un carrito de compras asociado a este usuario', 404));            
            const products = response?.products;   
            const totalCart = await this.shoppingCartUseCase.getTotalCart(products);    
            const weight = await this.shoppingCartUseCase.getTotalWeight(products);                                         
            const shippingCost : any = await this.shippingCostUseCase.findShippingCost(weight);                         
            const responseData = response.toJSON();
            if(products.length > 0){
                const newproducts: any = await Promise.all(
                    products.map(async (product: any) => {
                        let stock;
                        if(product?.variant){
                            stock = await this.stockStoreHouseUseCase.getVariantStock(product.variant?._id, this.onlineStoreHouse);
                        }else{
                            stock = await this.stockStoreHouseUseCase.getProductStock(product.item?._id, this.onlineStoreHouse);
                        }
                        return { ...product.toJSON(), stock: stock?.stock ?? 0 };
                    })
                )            
                responseData.products = [...newproducts];
            }                        
            const price = shippingCost?.price_weight || 0
            const updatedResponse = {
                ...responseData,
                total_cart: totalCart,
                shipping_cost: price,
                totalWithShipping: totalCart + price
            }                                                                    
            this.invoke(updatedResponse, 200, res, '', next);          
        } catch (error) {           
            console.log(error, "error");            
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async deleteShoppingCart(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.shoppingCartUseCase.deleteShoppingCart(id);
            this.invoke(response, 201, res, 'Eliminado con exito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error eliminar', 500));
        }
    }  
    
    public async emptyCart(req: Request, res: Response, next: NextFunction) {
        const user = req.user; 
        try {
            const cart: any | null = await this.shoppingCartUseCase.getShoppingCartByUser(user._id);
            if(!cart){
                return next(new ErrorHandler('Este usuario no tiene carrito de compras', 404));
            }
            const response = await this.shoppingCartUseCase.updateShoppingCart(cart._id.toString(), { products: [] });
            this.invoke(response, 201, res, 'Carrito de compras vaciado', next);
        } catch (error) {
            console.log(error);            
            next(new ErrorHandler('Hubo un error eliminar', 500));
        }
    }

    public async deleteProductCart(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params; // product id
        const user = req.user;
        try {
            if(!id) return next(new ErrorHandler('El id del producto es requerido', 404));
            const response : any | null = await this.shoppingCartUseCase.getShoppingCartByUser(user._id)
            if(!response) return next(new ErrorHandler('No existe un carrito de compras asociado a este usuario', 404));
            const products = response?.products;
            const productsFiltered = products?.filter((product: any) => product?._id.toString() !== id);
            const response2 = await this.shoppingCartUseCase.updateShoppingCart(response._id.toString(), { products: productsFiltered })

            this.invoke(response2, 201, res, 'Eliminado con exito', next);
        } catch (error) {               
            console.log(user);
                                    
            next(new ErrorHandler('Hubo un error eliminar', 500));
        }
    }

    public async addToCart(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params; // ID del producto
        const user = req.user;
        const { quantity, variant_id = null } = req.body;        
        interface Product {
            item: ObjectId;
            variant?: ObjectId | null;
            quantity: number;
        }                        
        try {                                              
            // Validar entradas
            if(!quantity) return next(new ErrorHandler('La cantidad es requerida', 404));
            if(!id) return next(new ErrorHandler('El id del producto es requerido', 404));
            if (!ObjectId.isValid(id)) return next(new ErrorHandler('ID de producto inválido', 400));
            if (typeof quantity !== 'number') return next(new ErrorHandler('La cantidad debe ser un número', 400));                 
            let userCart;
            const newProduct : Product = {
                item: new ObjectId(id),
                variant: null,
                quantity: quantity
            };
            if(variant_id){                
              newProduct['variant'] = new ObjectId(variant_id);                
            }          
            // Obtener carrito de compras del usuario
            const responseShoppingCartUser : any = await this.shoppingCartUseCase.getShoppingCartByUser(user._id);                                                                                 
            if (responseShoppingCartUser) {                         
                userCart = responseShoppingCartUser
            }else{
                userCart = await this.shoppingCartUseCase.createShoppingCart({user_id: user._id, products: [] });                         
            }                                 
            let index;
            let stock;
            // Buscar el índice del producto en el carrito (si existe)
            if(variant_id){
                index = userCart.products.findIndex((product: any) => { 
                    if(product.variant){
                        return product.variant._id.equals(variant_id)
                    }
                    return false
                });
                stock = await this.stockStoreHouseUseCase.getVariantStock(variant_id, this.onlineStoreHouse);
            }else{
                index = userCart.products.findIndex((product: any) => product.item._id.equals(id));      
                stock = await this.stockStoreHouseUseCase.getProductStock(id, this.onlineStoreHouse);                 
            }            
            // Si el producto ya está en el carrito, actualizar la cantidad
            if (index !== -1) {
                const productInCart = userCart.products[index];
                const stockProducto = stock?.stock;
                const totalQuantity = productInCart?.quantity + quantity;
                console.log("stock de producto", stockProducto);
                
                if(totalQuantity > stockProducto){
                    productInCart.quantity = stockProducto
                }else{
                    productInCart.quantity += quantity;
                }                           
            } 
            // Si el producto no está en el carrito, agregarlo
            if(index === -1){
                userCart.products.push(newProduct);
            }                     
            // console.log(userCart._id, "userCart");                                                                                    
            const response = await this.shoppingCartUseCase.updateShoppingCart(userCart._id, { products: userCart.products });                       
            this.invoke(response, 201, res, 'Carrito de compras actualizado', next);
        } catch (error) {          
            console.error('Error actualizando el carrito de compras:', error);
            next(new ErrorHandler('Hubo un error al actualizar el carrito', 500));
        }
    }
   
    public async replaceProductQuantity(req: Request, res: Response, next: NextFunction) {        
        const user = req.user;
        const { id, quantity } = req.body;
        try{
            if(!quantity) return next(new ErrorHandler('La cantidad es requerida', 404));
            if(!id) return next(new ErrorHandler('El id del producto es requerido', 404));
            if (!ObjectId.isValid(id)) return next(new ErrorHandler('ID de producto inválido', 400));
            if (typeof quantity !== 'number') return next(new ErrorHandler('La cantidad debe ser un número', 400)); 
               // Obtener el carrito de compras del usuario
            const responseShoppingCartUser = await this.shoppingCartUseCase.getShoppingCartByUser(user._id);    
            if (responseShoppingCartUser && responseShoppingCartUser.products) {
                // Encontrar el índice del producto en el carrito
                const index = responseShoppingCartUser.products.findIndex(product => product._id.equals(id));    
                // Validar si el producto fue encontrado
                if (index !== -1) {
                responseShoppingCartUser.products[index].quantity = quantity;
                // Actualizar el carrito de compras
                const response = await this.shoppingCartUseCase.updateShoppingCart(responseShoppingCartUser._id.toString(), { products: responseShoppingCartUser.products });
                // Enviar respuesta al cliente
                this.invoke(response, 201, res, 'Carrito de compras actualizado', next);
                } else {
                // Producto no encontrado en el carrito
                    next(new ErrorHandler('Producto no encontrado en el carrito', 404));
                }
            } else {
                // Carrito de compras no encontrado
                next(new ErrorHandler('Carrito de compras no encontrado', 404));
            }
        }catch(error){
            console.log("error en replaceProductQuantity" + error);        
            next(new ErrorHandler('Hubo un error al remplazar la cantidad', 500));
        }
        
    }
    

    public async updateProductQuantity(req: Request, res: Response, next: NextFunction): Promise<void> {        
        const user = req.user;
        const { id, quantity } = req.body;    
        try {
          // validar inputs  
          if(!quantity) return next(new ErrorHandler('La cantidad es requerida', 404));
          if(!id) return next(new ErrorHandler('El id del producto es requerido', 404));
          if (!ObjectId.isValid(id)) return next(new ErrorHandler('ID de producto inválido', 400));
          if (typeof quantity !== 'number') return next(new ErrorHandler('La cantidad debe ser un número', 400)); 
          // Obtener el carrito de compras del usuario
          const responseShoppingCartUser = await this.shoppingCartUseCase.getShoppingCartByUser(user._id);    
          if (responseShoppingCartUser && responseShoppingCartUser.products) {
             const index = responseShoppingCartUser.products.findIndex(product => product._id.equals(id));    
             // console.log("index was setted");            
             if (index !== -1) {
                // Si el producto ya está en el carrito, actualizar la cantidad
                responseShoppingCartUser.products[index].quantity += quantity;   
                 // Actualizar el carrito de compras
                const response = await this.shoppingCartUseCase.updateShoppingCart(responseShoppingCartUser._id.toString(), { products: responseShoppingCartUser.products });
                // Enviar respuesta al cliente
                this.invoke(response, 201, res, 'Carrito de compras actualizado', next);            
            } 
            if(index === -1){
                // Si el producto no está en el carrito, agregarlo
                return next(new ErrorHandler('Producto no encontrado en el carrito', 404));
            }      
          } else {
            // Carrito de compras no encontrado
            next(new ErrorHandler('Carrito de compras no encontrado', 404));
          }
        } catch (error) {
          console.error(error);
          next(new ErrorHandler('Hubo un error al actualizar el carrito', 500));
        }
    }

    public async mergeCart(req: Request, res: Response, next: NextFunction) {    
        const user = req.user;
        const { products } = req.body;
        try {                                                                              
            const parseProducts = JSON.parse(products);                           
            if (!parseProducts || parseProducts.length === 0) return next(new ErrorHandler('No se encontraron productos', 404));                                                                   
            const cartUser : any = await this.shoppingCartUseCase.getShoppingCartByUser(user._id);                       
            if(!cartUser){
                const newcart : any | null = await this.shoppingCartUseCase.createShoppingCart({user_id: user._id, products: []});     
                const products: any = [];
                parseProducts.forEach((product: any) => {
                    const producto : any = {
                        item: new ObjectId(product.item),
                        variant: product?.variant ? new ObjectId(product?.variant) : null,
                        quantity: product.quantity
                    }
                    products.push(producto);
                }) 
                const updatedCart = await this.shoppingCartUseCase.updateShoppingCart(newcart?._id, { products: products });                         
                return this.invoke(updatedCart, 200, res, '', next);                          
            }                        
            const productsCart = cartUser?.products;                                             
            await Promise.all(
                parseProducts.map(async (product: any) => {
                    let stock;
                    const producto: any = {
                        item: new ObjectId(product?.item),
                        variant: product?.variant ? new ObjectId(product?.variant) : null,
                        quantity: product.quantity,
                    };
            
                    let index;
                    if (product?.variant) {
                        stock = await this.stockStoreHouseUseCase.getVariantStock(product.variant, this.onlineStoreHouse);
                        index = productsCart.findIndex((item: any) => item?.variant?._id.equals(product.variant));
                    } else {
                        stock = await this.stockStoreHouseUseCase.getProductStock(product.item, this.onlineStoreHouse);
                        index = productsCart.findIndex((item: any) => item.item?._id.equals(product.item));
                    }                                                
                    if (index !== -1) {
                         const productInCart = productsCart[index];
                        const totalQuantity = productInCart?.quantity + product.quantity;
                        if(totalQuantity > stock.stock){
                            productInCart.quantity = stock.stock
                        }else{
                            productInCart.quantity += product.quantity;
                        }
                    } else {
                        // Agregar el nuevo producto al carrito
                        productsCart.push(producto);
                    }
                })
            );                                                              
             const response  = await this.shoppingCartUseCase.updateShoppingCart(cartUser?._id, { products: productsCart });                                                       
             this.invoke(response, 200, res, '', next);                                 
            } catch (error) {            
                console.log(error);
                next(new ErrorHandler('Hubo un error al fusionar el carrito', 500));
            }
    }

    public async noAuthCart(req: Request, res: Response, next: NextFunction) {
        let { items } = req.body
        try {
          items = JSON.parse(items);
          if(!items) return next(new ErrorHandler("Hubo un error al obtener la información", 500));
          if(items.length >= 10) return next(new ErrorHandler("Inicia sesión para agregar mas productos a tu carrito", 400)); 
          const noAuthCart = await Promise.all(items.map(async (item: any) => {
            const product: any | null = await this.productUseCase.getProduct(item.item);
            if(!product) return ;               
            let variant: any | null;
            let stock: any | null;
            if(item.variant){
                variant = await this.variantProductUseCase.findVariantById(item.variant);
                stock = await this.stockStoreHouseUseCase.getVariantStock(item.variant, this.onlineStoreHouse);
            }else{
                stock = await this.stockStoreHouseUseCase.getProductStock(item.item, this.onlineStoreHouse);  
            }                   
            return {
              _id: item._id,  
              variant: variant,  
              item: product,              
              quantity: item.quantity,
              stock: stock.stock ?? 0,
            }           
          }))                    
          
          this.invoke(noAuthCart, 200, res, "", next);
        } catch (error) {
          console.log("error no auth cart:", error);            
          next(new ErrorHandler("Hubo un error al obtener la información", 500));
        }
    }

}