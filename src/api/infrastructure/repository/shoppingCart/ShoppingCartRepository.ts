import { Model } from 'mongoose';

import { ShoppingCartRepository as ShoppingCartConfig } from '../../../domain/shoppingCart/shoppingCartRepository';
import { MongoRepository } from '../MongoRepository';

import { ServicesEntity } from '../../../domain/services/ServicesEntity';
import { ShoppingCartEntity } from '../../../domain/shoppingCart/shoppingCartEntity';
import { ProductShopping } from '../../../domain/product/ProductEntity';
import { ObjectId } from 'mongodb';

export class ShoppingCartRepository extends MongoRepository implements ShoppingCartConfig {

    constructor(protected ShoppingCartModel: Model<any>) {
        super(ShoppingCartModel)
    }

    async findOneShoppingCart(query: Object): Promise<ShoppingCartEntity | null> {
        return await this.findOneItem(query);
    }

    // async findCartByUser(userId: string): Promise<ShoppingCartEntity | null>{
    //       const result = await this.MODEL.aggregate([
    //         // Filtrar el carrito de compras por el ID del usuario
    //         { $match: { user_id: new ObjectId(userId) } },
            
    //         // Desempaquetar el array de productos para que podamos trabajar con ellos individualmente
    //         { $unwind: '$products' },
            
    //         // Hacer un lookup para poblar la información del producto
    //         {
    //           $lookup: {
    //             from: 'products',  // Colección de productos
    //             localField: 'products',  // Campo en ShoppingCart que queremos poblar
    //             foreignField: '_id',  // Campo en Product que referencia al producto
    //             as: 'products',  // Nombre del campo donde se almacenarán los detalles del producto
    //           }
    //         },
            
    //         // Desempaquetar el array de productDetails
    //         { $unwind: '$products' },
      
    //         // Hacer otro lookup para poblar la información del stock del producto
    //         {
    //           $lookup: {
    //             from: 'stocks',  // Colección de stocks
    //             localField: 'products.stock_id',  // Campo en Product que queremos poblar
    //             foreignField: '_id',  // Campo en Stock que referencia al stock
    //             as: 'stockDetails',  // Nombre del campo donde se almacenarán los detalles del stock
    //           }
    //         },
      
    //         // Desempaquetar el array de stockDetails
    //         { $unwind: '$stockDetails' },
      
    //         // Opcional: filtrar por status true en el stock
    //         { $match: { 'stockDetails.status': true } },
      
    //         // Proyectar los campos que deseas en el resultado final
    //         {
    //           $project: {
    //             _id: '$productDetails._id',
    //             name: '$productDetails.name',
    //             description: '$productDetails.description',
    //             stock: '$stockDetails.stock',
    //             // Otros campos que desees incluir
    //           }
    //         }
    //       ])
    //       return result;

    //     }



    
}