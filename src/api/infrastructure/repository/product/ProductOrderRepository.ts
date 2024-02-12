import { Model } from 'mongoose';
import { ProductOrderRepository as ProductOrderConfig } from '../../../domain/product/ProductOrderRepository'
import { MongoRepository } from '../MongoRepository';
import {  ProductOrderEntity, ProductOrderResume } from '../../../domain/product/ProductEntity';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import moment from 'moment';
import { response } from 'express';


export class ProductOrderRepository extends MongoRepository implements ProductOrderConfig  {

    constructor(protected ProductOrderModel: Model<any>) {
        super(ProductOrderModel);
    }

    async findOrderProduct(query: Object): Promise<ProductOrderEntity | ErrorHandler | null> {
        return await this.findOneItem(query);
    }

    async findAllProductOrders(populateConfig1?:any): Promise<ProductOrderEntity[] | ErrorHandler | null> {
        return await this.MODEL.find({}).populate(populateConfig1).sort({ createdAt: -1 })
    }

     async getProductOrdersByUser( _id: string, populateConfig1?:any): Promise<ProductOrderEntity[] | ErrorHandler| null > {
        return await this.MODEL.find({user_id:_id}).populate(populateConfig1).sort({ createdAt: -1 })
        
      }

      async ResumeProductOrders(): Promise< ProductOrderResume > {
   
            // Obtener el inicio y el fin del día actual
            const startOfDay = moment().startOf('day').toDate();
            const endOfDay = moment().endOf('day').toDate();
            
            const queryDay = {
                payment_status: "approved",
                createdAt: {
                    $gte: startOfDay,
                    $lt: endOfDay
                }
            };
    
            const salesDay: ProductOrderEntity[] = await this.MODEL.find(queryDay);
            const numDay = salesDay.length;
            const totalSumDay = salesDay.reduce((sum, item) => sum + item.total, 0);
            
    
            // Obtener el inicio y el fin del mes actual
            const startOfMonth = moment().startOf('month').toDate();
            const endOfMonth = moment().endOf('month').toDate();
    
            const queryMonth = {
                payment_status: "approved",
                createdAt: {
                    $gte: startOfMonth,
                    $lt: endOfMonth
                }
            };
    
            const salesMonth: ProductOrderEntity[]  = await this.MODEL.find(queryMonth);
            const numMonth = salesMonth.length;
            const totalSumMoth = salesMonth.reduce((sum, item) => sum + item.total, 0);
    
            return { ordersDay: numDay, ordersMonth: numMonth, cashDay:totalSumDay, cashMonth:totalSumMoth };
        
        
      }
      

}