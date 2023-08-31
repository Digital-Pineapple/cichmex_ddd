import { Model } from 'mongoose';

import { ServicesCustomerRepository as ServicesCustomerConfig } from '../../../domain/servicesCustomer/ServicesCustomerRepository';
import { MongoRepository } from '../MongoRepository';
import { ServiceCustomer } from '../../../domain/servicesCustomer/ServicesCustomerEntity';

export class ServicesCustomerRepository extends MongoRepository implements ServicesCustomerConfig {

    constructor(protected ServiceCustomerModel: Model<any>) {
        super(ServiceCustomerModel)
    }

    async findOneServiceCustomer(query: Object): Promise<ServiceCustomer | null> {
        return await this.findOneItem(query);
    }

    async findByIdServiceCustomer(_id: String): Promise<ServiceCustomer | null> {
        return await this.findById(_id);
    }
    async findAndUpdateServiceCustomer(_id: String, updated: object): Promise<ServiceCustomer | null> {
        return await this.updateOne(_id, updated);
    }
    async findAllServicesCustomers(): Promise<ServiceCustomer[] | null> {
        return await this.findAll();
    }

    async createOneCustomer(body: Object): Promise<ServiceCustomer | null> {
        return await this.createOne(body);
    }

    async deleteOneServiceCustomer(_id: string): Promise<ServiceCustomer | null> {
        return await this.ServiceCustomerModel.findByIdAndUpdate(_id, { status: false }, { new: true });
    }
}