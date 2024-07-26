import { Model } from 'mongoose';
import { ProductOrderRepository as ProductOrderConfig } from '../../../domain/product/ProductOrderRepository'
import { MongoRepository } from '../MongoRepository';
import { ProductOrderEntity, ProductOrderResume } from '../../../domain/product/ProductEntity';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import moment from 'moment';
import { response } from 'express';
import { InfoPayment, PopulateDetailMembership } from '../../../../shared/domain/PopulateInterfaces';


export class ProductOrderRepository extends MongoRepository implements ProductOrderConfig {

    constructor(protected ProductOrderModel: Model<any>) {
        super(ProductOrderModel);
    }

    async findOrderProduct(query: Object): Promise<ProductOrderEntity | ErrorHandler | null> {
        return await this.findOneItem(query);
    }

    async findAllProductOrders(populateConfig1?: any): Promise<ProductOrderEntity[] | ErrorHandler | null> {
        return await this.MODEL.find({}).populate(populateConfig1).sort({ createdAt: -1 })
    }

    async getProductOrdersByUser(_id: string, populateConfig1?: any): Promise<ProductOrderEntity[] | ErrorHandler | null> {
        return await this.MODEL.find({ user_id: _id }).populate(populateConfig1).sort({ createdAt: -1 })

    }

    async getProductOrdersByBranch(_id: string): Promise<ProductOrderEntity[] | ErrorHandler | null> {
        return await this.ProductOrderModel.find({ branch: _id }).sort({ createdAt: -1 })

    }

    async getPaidProductOrders(): Promise<ProductOrderEntity[] | ErrorHandler | null> {
        return await this.ProductOrderModel.find({payment_status:'approved', storeHouseStatus:false, route_status:false, point_pickup_status:false,deliveryStatus:false}).sort({ createdAt: -1 })

    }

    async getPaidAndSuplyToPointPO(): Promise<ProductOrderEntity[] | ErrorHandler | null> {
        return await this.ProductOrderModel.find({payment_status:'approved', storeHouseStatus:true, route_status:false, point_pickup_status:false,deliveryStatus:false}).sort({ createdAt: -1 })

    }

    async ResumeProductOrders(): Promise<ProductOrderResume> {

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

        const salesDay: ProductOrderEntity[] = await this.MODEL.find(queryDay).populate(InfoPayment);
        const numDay = salesDay.length;
        const totalSumDay = salesDay.reduce((sum, item) => sum + item.total, 0);
        const SalesMoneyDayMP = salesDay.map((item: any) => item.payment.MP_info.transaction_details.net_received_amount)
        const totalPayMoneyDayMP = SalesMoneyDayMP.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const commissionPayed = totalSumMoth - totalPayMoneyMonthMP 


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

        const salesMonth: ProductOrderEntity[] = await this.MODEL.find(queryMonth).populate(InfoPayment);
        const numMonth = salesMonth.length;
        const totalSumMoth = salesMonth.reduce((sum, item) => sum + item.total, 0);

        const SalesMoneyMonthMP = salesMonth.map((item: any) => item.payment.MP_info.transaction_details.net_received_amount)
        const totalPayMoneyMonthMP = SalesMoneyMonthMP.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const commissionPayedMonth = totalSumMoth - totalPayMoneyMonthMP 
        

        return { ordersDay: numDay, ordersMonth: numMonth, cashDay: totalSumDay, cashMonth: totalSumMoth, MPTotalPaymentsMonth: totalPayMoneyMonthMP, commissionPayedMonth:commissionPayedMonth };


    }


}