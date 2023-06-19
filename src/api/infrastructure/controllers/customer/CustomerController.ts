import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';

import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';

import { CustomerUseCase } from '../../../application/customer/CustomerUseCase';

export class CustomerController extends ResponseData {

    protected path = '/customers';

    constructor(private customerUseCase: CustomerUseCase, private readonly s3Service: S3Service) {
        super();
        this.getAllCustomers = this.getAllCustomers.bind(this);
        this.createCustomer = this.createCustomer.bind(this);
        this.getCustomerDetail = this.getCustomerDetail.bind(this);
        this.updateCustomer = this.updateCustomer.bind(this);
        this.deleteCustomer = this.deleteCustomer.bind(this);
    }

    public async getAllCustomers(req: Request, res: Response, next: NextFunction) {
        try {
            const customers = await this.customerUseCase.getCustomers();
            await Promise.all(customers?.map(async (customer: Customer) => {
                const ine = await this.s3Service.getUrlObject(customer.ine + ".pdf");
                customer.ine = ine;
                const curp = await this.s3Service.getUrlObject(customer.curp + ".pdf");
                customer.curp = curp;
                const criminal_record = await this.s3Service.getUrlObject(customer.criminal_record + ".pdf");
                customer.criminal_record = criminal_record;
                const prook_address = await this.s3Service.getUrlObject(customer.prook_address + ".pdf");
                customer.prook_address = prook_address;
                customer.profile_image = await this.s3Service.getUrlObject(customer.profile_image);
            }));

            this.invoke(customers, 200, res, '', next);
        } catch (error) {
            console.log(error);

            next(new ErrorHandler('Hubo un error al consultar los usuarios', 500));
        }
    }

    public async getCustomerDetail(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        try {
            const customer = await this.customerUseCase.getDetailCustomer(id);
            customer.ine = await this.s3Service.getUrlObject(customer?.ine + ".pdf");
            customer.curp = await this.s3Service.getUrlObject(customer?.curp + ".pdf");
            customer.criminal_record = await this.s3Service.getUrlObject(customer?.criminal_record + ".pdf");
            customer.prook_address = await this.s3Service.getUrlObject(customer?.prook_address + ".pdf");
            
            this.invoke(customer, 200, res, '', next)
        } catch (error) {
            next(new ErrorHandler('Error al encontrar el usuario', 404));
        }
    }

    public async createCustomer(req: Request, res: Response, next: NextFunction) {
        const { fullname, email, password } = req.body;
        try {
            const customer = await this.customerUseCase.createNewCustomer(fullname, email, password);
            this.invoke(customer, 201, res, 'El usuario se creo con exito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al crear el usuario', 500))
        }
    }

    public async updateCustomer(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { fullname } = req.body;

        try {
            const customer = await this.customerUseCase.updateOneCustomer(id, { fullname });
            this.invoke(customer, 200, res, 'El usuario se actualizo con exito', next);
        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al actualizar el usuario', 500));
        }
    }


    public async deleteCustomer(req: Request, res: Response, next: NextFunction) {

        const { id } = req.params;

        try {
            const customer = await this.customerUseCase.updateOneCustomer(id, { status: false });
            this.invoke(customer, 200, res, 'El usuario ha sido eliminado', next);
        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al eliminar el usuario', 500));
        }

    }

    public async convertUserToPartner(req: Request, res: Response, next: NextFunction) {
        const { user } = req;
        try {
            const customer = await this.customerUseCase.becomeAPartner(user._id);
            this.invoke(customer, 200, res, 'Felicidades ahora formas parte de nuestra familia', next);
        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al eliminar el usuario', 500));
        }
    }

}