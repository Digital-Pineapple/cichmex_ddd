import { Model } from 'mongoose';
import { ProductOrderRepository as ProductOrderConfig } from '../../../domain/product/ProductOrderRepository'
import { MongoRepository } from '../MongoRepository';
import { ProductOrderEntity, ProductOrderResume } from '../../../domain/product/ProductEntity';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import moment from 'moment';
import { InfoAddressOrder, InfoBranch, InfoBranchOrder, InfoPayment, PopulateBranch, PopulatePayment } from '../../../../shared/domain/PopulateInterfaces';


export class ProductOrderRepository extends MongoRepository implements ProductOrderConfig {

    constructor(protected ProductOrderModel: Model<any>) {
        super(ProductOrderModel);
    }

    async findOrderProduct(query: Object): Promise<ProductOrderEntity | ErrorHandler | null> {
        return await this.findOneItem(query);
    }


    async findAllProductOrders(populateConfig1?: any, populateConfig2?: any, populateConfig3?: any, populateConfig4?:any): Promise<ProductOrderEntity[] | ErrorHandler | null> {
        const response: any = await this.ProductOrderModel.find().
            populate(populateConfig1).
            populate(populateConfig2).
            populate(populateConfig3).
            populate(populateConfig4).
            sort({ createdAt: -1 })
        return response
    }

    async getProductOrdersByUser(_id: string, populateConfig1?: any, populateConfig2?: any): Promise<ProductOrderEntity[] | ErrorHandler | null> {
        const response: any = await this.ProductOrderModel.find({ user_id: _id }).populate(populateConfig1).populate(populateConfig2).sort({ createdAt: -1 })
        return response

    }

    async getProductOrdersByBranch(_id: string, populateConfig1?: any, populateConfig2?: any, populateConfig3?: any): Promise<ProductOrderEntity[] | ErrorHandler | null> {
        return await this.ProductOrderModel.find({ branch: _id, payment_status: 'approved' }).populate(populateConfig1)
        .populate(populateConfig2)
        .populate(populateConfig3)
        .sort({ createdAt: -1 })

    }
    async getPOExpired(): Promise<ProductOrderEntity[] | ErrorHandler | null> {

        const exp = moment().subtract(1, 'hours').toDate();

        const response = await this.ProductOrderModel.find({ payment_status: { $ne: 'approved' }, paymentType: 'transfer', verification: { $exists: false }, createdAt: { $lt: exp }, }).sort({ createdAt: -1 })
        return response
    }

    async getPaidProductOrders(): Promise<ProductOrderEntity[] | ErrorHandler | null> {
        return await this.ProductOrderModel.find({ payment_status: 'approved', storeHouseStatus: false }).sort({ createdAt: -1 })
    }
    async getPendingTransferPO(): Promise<ProductOrderEntity[] | ErrorHandler | null> {
        return await this.ProductOrderModel.find({ payment_status: { $in: ['pending', 'pending_to_verify'] }, storeHouseStatus: false, paymentType: 'transfer' }).sort({ createdAt: -1 }).populate(PopulatePayment)
    }

    async getPaidAndSuplyToPointPO(): Promise<ProductOrderEntity[] | ErrorHandler | null> {
        return await this.ProductOrderModel.find({ payment_status: 'approved', storeHouseStatus: true, route_status: false, 'route_detail.route_status': { $ne: 'assigned' } }).sort({ createdAt: -1 }).populate(PopulateBranch)
    }

    async getPaidAndVerifyPackageToPointPO(user_id : any): Promise<ProductOrderEntity[] | ErrorHandler | null> {
        return await this.ProductOrderModel.find({ payment_status: 'approved', storeHouseStatus: true, route_status: false, 'route_detail.route_status': { $eq: 'assigned' }, 'route_detail.user':{$eq: user_id}, order_status: 4 }).sort({ createdAt: -1 }).populate(PopulateBranch)
    }

    async getAssignedRou(): Promise<ProductOrderEntity[] | ErrorHandler | null> {
        return await this.ProductOrderModel.find({ payment_status: 'approved', storeHouseStatus: true, route_status: false, order_status: 3 }).sort({ createdAt: -1 })
    }

    async getAssignedPO(): Promise<ProductOrderEntity[] | ErrorHandler | null> {
        return await this.ProductOrderModel.find({ payment_status: 'approved', 'route_detail.route_status': 'assigned', storeHouseStatus: true, route_status: false, order_status: 3 }).sort({ createdAt: -1 })
    }

    async getAssignedPOUser(user_id: any): Promise<ProductOrderEntity[] | ErrorHandler | null> {
        return await this.ProductOrderModel.find({ payment_status: 'approved', 'route_detail.route_status': 'assigned', 'route_detail.user': user_id, storeHouseStatus: true, route_status: false, order_status: 3 }).populate(InfoBranchOrder).populate(InfoAddressOrder).sort({ createdAt: -1 })
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
            },
            paymentType: { $ne: 'transfer' }
        };


        // Obtener el inicio y el fin del mes actual
        const startOfMonth = moment().startOf('month').toDate();
        const endOfMonth = moment().endOf('month').toDate();

        const queryMonth = {
            payment_status: "approved",
            createdAt: {
                $gte: startOfMonth,
                $lt: endOfMonth
            },
            paymentType: { $ne: 'transfer' }
        };
        const startOfYear = moment().startOf('year').toDate();
        const endOfYear = moment().endOf('year').toDate();

        const queryYear = {
            payment_status: "approved",
            createdAt: {
                $gte: startOfYear,
                $lt: endOfYear
            },
            paymentType: { $ne: 'transfer' }
        };

        const startOfWeek = moment().startOf('week').toDate();
        const endOfWeek = moment().endOf('week').toDate();

        const queryWeek = {
            payment_status: "approved",
            createdAt: {
                $gte: startOfWeek,
                $lt: endOfWeek
            },
            paymentType: { $ne: 'transfer' }
        };

        const salesDay: ProductOrderEntity[] = await this.ProductOrderModel.find(queryDay).populate(InfoPayment);

        const salesWeek: ProductOrderEntity[] = await this.ProductOrderModel.find(queryWeek).populate(InfoPayment);

        const salesMonth: ProductOrderEntity[] = await this.ProductOrderModel.find(queryMonth).populate(InfoPayment);

        const salesYear: ProductOrderEntity[] = await this.ProductOrderModel.find(queryYear).populate(InfoPayment);

        const lastTenSales: any = await this.ProductOrderModel.find({ payment_status: 'approved' }).populate(InfoPayment).sort({ createdAt: -1 }).limit(10).exec()

        const hours = Array.from({ length: 24 }, (_, i) => i);
        const salesDayByHour = hours.map(hour => ({
            hour,
            sales: salesDay.filter(sale => new Date(sale.createdAt).getUTCHours() === hour).length
        }));

        const numDay = salesDay.length;
        const totalSumDay = salesDay.reduce((sum, item: any) => sum + item.total, 0);
        const SalesMoneyDayMP = salesDay.map((item: any) => item.payment.MP_info.transaction_details.net_received_amount)
        const totalPayMoneyDayMP = SalesMoneyDayMP.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const commissionPayedDay = totalSumDay - totalPayMoneyDayMP

        const numWeek = salesWeek.length;
        const totalSumWeek = salesWeek.reduce((sum, item: any) => sum + item.total, 0);
        const SalesMoneyWeekMP = salesWeek.map((item: any) => item.payment.MP_info.transaction_details.net_received_amount)
        const totalPayMoneyWeekMP = SalesMoneyWeekMP.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const commissionPayedWeek = totalSumWeek - totalPayMoneyWeekMP

        const numMonth = salesMonth.length;
        const totalSumMoth = salesMonth.reduce((sum, item: any) => sum + item.total, 0);
        const SalesMoneyMonthMP = salesMonth.map((item: any) => item.payment.MP_info.transaction_details.net_received_amount)
        const totalPayMoneyMonthMP = SalesMoneyMonthMP.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const commissionPayedMonth = totalSumMoth - totalPayMoneyMonthMP


        const numYear = salesYear.length;
        const totalSumYear = salesYear.reduce((sum, item: any) => sum + item.total, 0);
        const SalesMoneyYearMP = salesYear.map((item: any) => item.payment.MP_info.transaction_details.net_received_amount)
        const totalPayMoneyYearMP = SalesMoneyYearMP.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const commissionPayedYear = totalSumYear - totalPayMoneyYearMP

        const topProductsMonth = await this.MODEL.aggregate([
            { $unwind: '$products' }, // Descomponemos el array de productos
            {
                $group: {
                    _id: "$products.item._id",
                    totalQuantity: { $sum: "$products.quantity" },
                    productName: { $first: "$products.item.name" }
                }
            },
            { $sort: { totalQuantity: -1 } }, // Ordenamos por cantidad total en orden descendente
            { $limit: 10 } // Seleccionamos los 10 primeros
        ]);



        function roundToTwo(num: number) {
            return Math.round(num * 100) / 100;
        }


        return {
            ordersDay: numDay,
            ordersWeek: numWeek,
            ordersMonth: numMonth,
            ordersYear: numYear,

            cashDay: totalSumDay,
            cashWeek: totalSumWeek,
            cashMonth: totalSumMoth,
            cashYear: totalSumYear,

            recivedCashDay: roundToTwo(totalPayMoneyDayMP),
            recivedCashWeek: roundToTwo(totalPayMoneyWeekMP),
            recivedCashMonth: roundToTwo(totalPayMoneyMonthMP),
            recivedCashYear: roundToTwo(totalPayMoneyYearMP),

            commissionPayedDay: roundToTwo(commissionPayedDay),
            commissionPayedWeek: roundToTwo(commissionPayedWeek),
            commissionPayedMonth: roundToTwo(commissionPayedMonth),
            commissionPayedYear: roundToTwo(commissionPayedYear),
            salesDayByHour: salesDayByHour,
            topProductsMonth: topProductsMonth,
            lastTen: lastTenSales
        };


    }


}