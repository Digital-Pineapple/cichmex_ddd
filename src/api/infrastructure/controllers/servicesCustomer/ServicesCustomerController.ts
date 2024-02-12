import { NextFunction, Request, Response, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';

import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';

import { ServiceCustomerUseCase } from '../../../application/servicesCustomer/ServiceCustomerUseCase';


export class ServicesCustomerController extends ResponseData {

    protected path = '/service_customer';

    constructor(private serviceCustomerUseCase: ServiceCustomerUseCase, private readonly s3Service: S3Service) {
        super();
        this.getAllServicesCustomer = this.getAllServicesCustomer.bind(this);
        this.getServiceCustomerDetail = this.getServiceCustomerDetail.bind(this);
        this.createServiceCustomer = this.createServiceCustomer.bind(this);
        this.updateServiceCustomer = this.updateServiceCustomer.bind(this);
        // this.deleteServiceCustomer = this.deleteServiceCustomer.bind(this);
        this.updateTypeCarSC = this.updateTypeCarSC.bind(this);
        this.getServicesCustomerDetailByCustomer = this.getServicesCustomerDetailByCustomer.bind(this);
        this.deleteOneSC = this.deleteOneSC.bind(this);
    }

    public async getAllServicesCustomer(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.serviceCustomerUseCase.getServicesCustomer();
            this.invoke(response, 200, res, "", next);

        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar los servicios', 500));
        }
    }

    public async getServiceCustomerDetail(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.serviceCustomerUseCase.getDetailServiceCustomer(id);
            this.invoke(response, 200, res, '', next)
        } catch (error) {
            next(new ErrorHandler('Error al encontrar el servicio', 404));
        }
    }
    public async getServicesCustomerDetailByCustomer(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        
        try {
            const response = await this.serviceCustomerUseCase.getServiceCustomerByCustomer(id);
            
            this.invoke(response, 200, res, '', next)
        } catch (error) {
           
            
            next(new ErrorHandler('Error al encontrar el servicio', 404));
        }
    }

    public async createServiceCustomer(req: Request, res: Response, next: NextFunction) {
        const { customer_id, services  } = req.body;
      
        
        try { 
        const serviceCustomer = await this.serviceCustomerUseCase.createNewServiceCustomer(customer_id,services);
            this.invoke(serviceCustomer, 201, res, 'Se creo con exito', next);
        } catch (error) {
           
            
            next(new ErrorHandler('Hubo un error al crear su servicio', 500))
        }
    }

    public async updateServiceCustomer(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
       
       const services = req.body

        try {

            const response = await this.serviceCustomerUseCase.updateOneServiceCustomer(id,services)
            
            this.invoke(response, 201, res, 'La comisión se actualizó con éxito', next); 
    
            
        } catch (error) {
            
            next(new ErrorHandler('Hubo un error al editar la información', 500));

        }
    }
    public async updateTypeCarSC(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response  = await this.serviceCustomerUseCase.updateOneSCTypeCars(id, req.body.service_id, req.body.typeCarService);
            this.invoke(response, 201, res, 'Actualizado con exito', next);
            
        } catch (error) {
           
            next(new ErrorHandler('Hubo un error type car service', 500));
            
        }
    }


    // public async deleteServiceCustomer(req: Request, res: Response, next: NextFunction) {

    //     const { id } = req.params;

    //     try {
    //         const response = await this.serviceCustomerUseCase.updateOneServiceCustomer(id, {deleted: false} );
    //         this.invoke(response, 200, res, 'Eliminado correctamente', next);
    //     } catch (error) {
    //        
    //         next(new ErrorHandler('Hubo un error al eliminar', 500));
    //     }

    // }
    public async deleteOneSC(req: Request, res: Response, next: NextFunction) {

        const { id } = req.params;
        const service_id = req.body
        
        try {
            const response = await this.serviceCustomerUseCase.deleteOneServiceCustomer(id, service_id);
            this.invoke(response, 200, res, 'Eliminado correctamente', next);
        } catch (error) {
           
            next(new ErrorHandler('Hubo un error al eliminar', 500));
        }

    }

}