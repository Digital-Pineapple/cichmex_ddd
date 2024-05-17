import { Model } from 'mongoose';
import { PaymentRepository as PaymentRepositoryConfig } from '../../../domain/payments/PaymentRepository';
import { MongoRepository } from '../MongoRepository';
import PaymentModel from '../../models/payments/PaymentModel';
import  {PaymentEntity}  from '../../../domain/payments/PaymentEntity';
import _ from 'mongoose-paginate-v2';

export class PaymentRepository extends MongoRepository implements PaymentRepositoryConfig {

    constructor(protected PaymentModel: Model<any>) {
        super(PaymentModel);
    }
    async findPayment(query: Object, populateConfig1?: any, populateConfig2?: any, populateConfig3?: any): Promise<any> {
        return await this.MODEL.find(query).populate(populateConfig1).populate(populateConfig2).populate(populateConfig3);
    }

    async findByIdCustomer(_id: string): Promise<PaymentEntity | null> {
        return await this.findById(_id);
    }

    async findAndUpdateCustomer(_id: string, updated: object): Promise<PaymentEntity | null> {
        return await this.updateOne(_id, updated);
    }

    async findAllCustomers(): Promise<PaymentEntity[] | null> {
        return await this.findAll();
    }

    async createOneCustomer(body: object): Promise<PaymentEntity | null> {
        return await this.createOne(body);
    }

   
}
