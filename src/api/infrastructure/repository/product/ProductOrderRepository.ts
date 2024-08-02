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
        return await this.ProductOrderModel.find({ branch: _id, payment_status: 'approved' }).sort({ createdAt: -1 })

    }

    async getPaidProductOrders(): Promise<ProductOrderEntity[] | ErrorHandler | null> {
        return await this.ProductOrderModel.find({ payment_status: 'approved', storeHouseStatus: false }).sort({ createdAt: -1 })

    }

    async getPaidAndSuplyToPointPO(): Promise<ProductOrderEntity[] | ErrorHandler | null> {
        return await this.ProductOrderModel.find({ payment_status: 'approved', storeHouseStatus: true, route_status: false, }).sort({ createdAt: -1 })

    }

    async getAssignedPO(): Promise<ProductOrderEntity[] | ErrorHandler | null> {
        return await this.ProductOrderModel.find({ payment_status: 'approved', 'route_detail.route_status': 'assigned', storeHouseStatus: true, route_status: false }).sort({ createdAt: -1 })

    }
    async getDeliveriesPO(): Promise<ProductOrderEntity[] | ErrorHandler | null> {
        return await this.ProductOrderModel.find({ payment_status: 'approved', storeHouseStatus: true, route_status: true, deliveryStatus: false }).sort({ createdAt: -1 })

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
        const startOfYear = moment().startOf('year').toDate();
        const endOfYear = moment().endOf('year').toDate();

        const queryYear = {
            payment_status: "approved",
            createdAt: {
                $gte: startOfYear,
                $lt: endOfYear
            }
        };


        const salesDay: ProductOrderEntity[] = await this.MODEL.find(queryDay).populate(InfoPayment);

        const hours = Array.from({ length: 24 }, (_, i) => i);
        const salesDayByHour = hours.map(hour => ({
            hour,
            sales: salesDay.filter(sale => new Date(sale.createdAt).getUTCHours() === hour).length
        }));

        const numDay = salesDay.length;
        const totalSumDay = salesDay.reduce((sum, item) => sum + item.total, 0);
        const SalesMoneyDayMP = salesDay.map((item: any) => item.payment.MP_info.transaction_details.net_received_amount)
        const totalPayMoneyDayMP = SalesMoneyDayMP.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const commissionPayedDay = totalSumDay - totalPayMoneyDayMP

        const salesMonth: ProductOrderEntity[] = await this.MODEL.find(queryMonth).populate(InfoPayment);
        const numMonth = salesMonth.length;
        const totalSumMoth = salesMonth.reduce((sum, item) => sum + item.total, 0);
        const SalesMoneyMonthMP = salesMonth.map((item: any) => item.payment.MP_info.transaction_details.net_received_amount)
        const totalPayMoneyMonthMP = SalesMoneyMonthMP.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const commissionPayedMonth = totalSumMoth - totalPayMoneyMonthMP


        const salesYear: ProductOrderEntity[] = await this.MODEL.find(queryYear).populate(InfoPayment);
        const numYear = salesYear.length;
        const totalSumYear = salesYear.reduce((sum, item) => sum + item.total, 0);
        const SalesMoneyYearMP = salesYear.map((item: any) => item.payment.MP_info.transaction_details.net_received_amount)
        const totalPayMoneyYearMP = SalesMoneyYearMP.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const commissionPayedYear = totalSumYear - totalPayMoneyYearMP

        function roundToTwo(num: number) {
            return Math.round(num * 100) / 100;
        }


        return {
            ordersDay: numDay,
            ordersMonth: numMonth,
            ordersYear: numYear,

            cashDay: totalSumDay,
            cashMonth: totalSumMoth,
            cashYear: totalSumYear,

            recivedCashDay: roundToTwo(totalPayMoneyDayMP),
            recivedCashMonth: roundToTwo(totalPayMoneyMonthMP),
            recivedCashYear: roundToTwo(totalPayMoneyYearMP),

            commissionPayedDay: roundToTwo(commissionPayedDay),
            commissionPayedMonth: roundToTwo(commissionPayedMonth),
            commissionPayedYear: roundToTwo(commissionPayedYear),
            salesDayByHour: salesDayByHour
        };


    }


}