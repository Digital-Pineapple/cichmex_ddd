import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { ServicesCustomerRepository } from '../../domain/servicesCustomer/ServicesCustomerRepository';
import { IServices, ServiceCustomer } from '../../domain/servicesCustomer/ServicesCustomerEntity';

export class ServiceCustomerUseCase {

    constructor(private readonly servicesCustomerRepository: ServicesCustomerRepository) { }


    public async getServicesCustomer(): Promise<ServiceCustomer[] | ErrorHandler | null> {
        return await this.servicesCustomerRepository.findAll();
    }

    public async getDetailServiceCustomer(_id: string): Promise<ServiceCustomer | null> {


        return await this.servicesCustomerRepository.findById(_id);
    }

    public async getServiceCustomerByCustomer(customer_id: string): Promise<ServiceCustomer | ErrorHandler | null> {

        return await this.servicesCustomerRepository.findByCustomer(customer_id);
    }



    public async createNewServiceCustomer(customer_id: string, services: IServices): Promise<ServiceCustomer | ErrorHandler | null> {
        const response = await this.servicesCustomerRepository.findOneItem({ customer_id, status:true });
        if (response) { return new ErrorHandler('Ya existen los servicios en este usuario', 400) }
        else {
            return await this.servicesCustomerRepository.createOne({ customer_id, services });
        }
    }

    public async updateOneServiceCustomer(_id: string, updated: object): Promise<ServiceCustomer | null> {
        const service = await this.servicesCustomerRepository.findById(_id);
        service.services = updated;
        return await this.servicesCustomerRepository.updateOne(_id, service);
    }

}