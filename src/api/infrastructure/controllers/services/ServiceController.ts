import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';

import { ServicesUseCase } from '../../../application/services/ServicesUseCase';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';

export class ServicesController extends ResponseData {
    protected path = '/services'

    constructor(private servicesUseCase: ServicesUseCase , private readonly s3Service:S3Service) {
        super();
        this.getAllServices     =   this.getAllServices.bind(this);
        this.getService         =   this.getService.bind(this);
        this.createService      =   this.createService.bind(this);
        this.updateService      =   this.updateService.bind(this);
        this.deleteService      =   this.deleteService.bind(this);
        this.searchService    =   this.searchService.bind(this);
    }

    public async getAllServices(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.servicesUseCase.getServices();
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getService(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.servicesUseCase.getDetailService(id);
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createService(req: Request, res: Response, next: NextFunction) {
        const { name, description, status, subCategory } = req.body;
        try {
            const response = await this.servicesUseCase.createNewService(name, description,status, subCategory);
            this.invoke(response, 201, res, 'El servicio se creo con exito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al crear el servicio', 500));
        }
    }

    public async updateService(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, description, status, subCategory } = req.body;
        try {
            const pathObject = `${this.path}/${id}/${req.file?.fieldname}`;

            const { message, key, url, success } = await this.s3Service.uploadToS3AndGetUrl(pathObject, req.file, "image/jpeg");
            if (!success) return new ErrorHandler('Hubo un error al subir la imagen', 400)
            const response = await this.servicesUseCase.updateOneService(id, { name, description, status, subCategory , service_image: key });
            console.log(response)
            response.service_image = url;
            this.invoke(response, 201, res, 'El servicio se actualizó con exito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al actualizar el servicio', 500));   
        }
    }

    public async deleteService(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.servicesUseCase.deleteOneService(id);
            this.invoke(response, 201, res, 'El servicio se elimino con exito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error eliminar el servicio', 500));   
        }
    }
    public async searchService(req: Request, res: Response, next: NextFunction) {
        const {search } = req.query;
        console.log(req.query);
        
        try {
            const response = await this.servicesUseCase.searchService(search);
            this.invoke(response, 201, res, 'Categoria encontrada', next);
        } catch (error) {
            console.log(error);
            
            next(new ErrorHandler('Hubo un error eliminar la categori', 500));   
        }
    }



}


