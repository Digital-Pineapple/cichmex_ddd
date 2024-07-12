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

export class ShoppingCartController extends ResponseData {
    protected path = '/shoppingCart'

    constructor(private shoppingCartUseCase: ShoppingCartUseCase,
    ) {
        super();
        this.getAllShoppingCarts = this.getAllShoppingCarts.bind(this);
        this.getShoppingCart = this.getShoppingCart.bind(this);
        this.createShoppingCart = this.createShoppingCart.bind(this);
        this.updateShoppingCart = this.updateShoppingCart.bind(this);
        this.deleteShoppingCart = this.deleteShoppingCart.bind(this);
        this.deleteMembershipInCart = this.deleteMembershipInCart.bind(this)
        this.deleteProductInCart = this.deleteProductInCart.bind(this)
        this.deleteProductsInShoppingCart = this.deleteProductsInShoppingCart.bind(this)
        this.updateShoppingCartProducts = this.updateShoppingCartProducts.bind(this);
        this.updateProductQuantity = this.updateProductQuantity.bind(this);
        this.mergeCart = this.mergeCart.bind(this);
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
        const { id } = req.params;
        try {
            const response = await this.shoppingCartUseCase.getShoppingCartByUser(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
           

            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }


    public async createShoppingCart(req: Request, res: Response, next: NextFunction) {
        const { user_id, products, membership } = req.body;
        try {
            let myproducts = products
            let response ;
            if(!products){
                myproducts = []
            }
            if(membership){
                 response = await this.shoppingCartUseCase.createShoppingCart({ user_id, products : myproducts, memberships: membership })
            }else{
                 response = await this.shoppingCartUseCase.createShoppingCart({ user_id, products : myproducts })
            }
            this.invoke(response, 200, res, '', next)
        } catch (error) {
           
            next(new ErrorHandler('Error', 500));
        }
    }



    
    public async updateShoppingCart(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { products, membership } = req.body;

        try {
            let updateData: any = {};

            if (products && products.length > 0) {
                updateData['products'] = products
            }

            if (membership && membership.length > 0) {
                updateData['membership'] = membership;
            }

            const response = await this.shoppingCartUseCase.updateShoppingCart(id, updateData);

            if (response !== null) {
                this.invoke(response, 201, res, '', next);
            } else {
                this.invoke({}, 404, res, 'Shopping cart not found', next);
            }
        } catch (error) {
           
            next(new ErrorHandler('Error', 500));
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
    public async deleteMembershipInCart(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        try {
            const response = await this.shoppingCartUseCase.updateShoppingCart(id, { memberships: [] })
          

            this.invoke(response, 201, res, 'Eliminado con exito', next);
        } catch (error) {
          

            next(new ErrorHandler('Hubo un error eliminar', 500));
        }
    }


    public async deleteProductInCart(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { user_id, cart_id } = req.body;

        try {

            const response = await this.shoppingCartUseCase.getShoppingCartByUser(user_id)
            const products = response?.products;
            const productsFiltered = products?.filter((product) => product?.item?._id.toString() !== id);
            const response2 = await this.shoppingCartUseCase.updateShoppingCart(cart_id, { products: productsFiltered })

            this.invoke(response2, 201, res, 'Eliminado con exito', next);
        } catch (error) {
            
            next(new ErrorHandler('Hubo un error eliminar', 500));
        }
    }

    public async deleteProductsInShoppingCart(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params; // shopping_car id

        try {
            const response = await this.shoppingCartUseCase.updateShoppingCart(id, { products: [] });
            this.invoke(response, 201, res, 'Carrito de compras vaciado', next);
        } catch (error) {
          
            next(new ErrorHandler('Hubo un error eliminar', 500));
        }
    }

    public async updateShoppingCartProducts(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params; // shopping_carid
        
        const { user_id, cart_id, quantity } = req.body;
        
        
        try {
            const responseShoppingCartUser = await this.shoppingCartUseCase.getShoppingCartByUser(user_id);
            const index = responseShoppingCartUser?.products?.findIndex(product => product.item?._id.equals(id));
            const newProduct = {
                item: new ObjectId(id),
                quantity
            }
            let response: any = '';
            if (index !== -1) {
                responseShoppingCartUser?.products[index].quantity += quantity;
            } else {
                responseShoppingCartUser?.products?.push(newProduct);
            }

            response = await this.shoppingCartUseCase.updateShoppingCart(cart_id, { products: responseShoppingCartUser?.products });
            
            this.invoke(response, 201, res, 'Carrito de compras actualizado', next);
        } catch (error) {
           
            next(new ErrorHandler('Hubo un error al actualizar el carrito', 500));
        }
    }


    public async updateProductQuantity(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params; // product_id
        const { user_id, cart_id, quantity } = req.body;
    
        try {
          // Obtener el carrito de compras del usuario
          const responseShoppingCartUser = await this.shoppingCartUseCase.getShoppingCartByUser(user_id);
    
          if (responseShoppingCartUser && responseShoppingCartUser.products) {
            // Encontrar el índice del producto en el carrito
            const index = responseShoppingCartUser.products.findIndex(product => product.item?._id.equals(id));
    
            // Validar si el producto fue encontrado
            if (index !== -1) {
              responseShoppingCartUser.products[index].quantity = quantity;
    
              // Actualizar el carrito de compras
              const response = await this.shoppingCartUseCase.updateShoppingCart(cart_id, { products: responseShoppingCartUser.products });
    
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
        } catch (error) {
          console.error(error);
          next(new ErrorHandler('Hubo un error al actualizar el carrito', 500));
        }
    }

    public async mergeCart(req: Request, res: Response, next: NextFunction) {        
        const { user_id, products } = req.body;
        try {
            
            const parseProducts = JSON.parse(products);
            if (!parseProducts || parseProducts.length === 0) {
                return next(new ErrorHandler('No se encontraron productos', 404));                                            
            }
            const responseShoppingCart = await this.shoppingCartUseCase.getShoppingCartByUser(user_id);  
            if (responseShoppingCart && responseShoppingCart.products) {

                const productsCart =  responseShoppingCart?.products;

                parseProducts.forEach((product: any) => {
                    const index = productsCart.findIndex((item: any) => item.item?._id.equals(product.item));
                    if (index !== -1) {
                        productsCart[index].quantity += product.quantity;
                    } else {
                        const producto:any = {
                            item: new ObjectId(product.item),
                            quantity: product.quantity
                        }
                        productsCart.push(producto);
                    }
                })

                const response = await this.shoppingCartUseCase.updateShoppingCart(responseShoppingCart?._id, { products: productsCart });                   
                this.invoke(response, 200, res, '', next);
            }else{
        // console.log(user_id,"cffgfg");

                next(new ErrorHandler('Carrito de compras no encontrado', 404));
            }
                        
        } catch (error) {            
            console.log(error);
            next(new ErrorHandler('Hubo un error al fusionar', 500));
        }
    }

}