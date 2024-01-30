import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';

import { ServicesUseCase } from '../../../application/services/ServicesUseCase';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';

export class ServicesController extends ResponseData {
    protected path = '/services'

    constructor(private servicesUseCase: ServicesUseCase, private readonly s3Service: S3Service) {
        super();
        this.getAllServices = this.getAllServices.bind(this);
        this.getService = this.getService.bind(this);
        this.createService = this.createService.bind(this);
        this.updateService = this.updateService.bind(this);
        this.deleteService = this.deleteService.bind(this);
        this.searchService = this.searchService.bind(this);
    }

    public async getAllServices(req: Request, res: Response, next: NextFunction) {
        try {
            
            const response = await this.servicesUseCase.getServices();
            await Promise.all(response.map(async (res) => {
                const url = await this.s3Service.getUrlObject(res.image + ".jpg");
                res.image = url;
            }));
            
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
   
    public async getService(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.servicesUseCase.getDetailService(id);
            const url = await this.s3Service.getUrlObject(response?.image + ".jpg");
            response.image = url;
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createService(req: Request, res: Response, next: NextFunction) {
        const { name, description, subCategory } = req.body;
        try {
            const response = await this.servicesUseCase.createNewService(name, description, subCategory);
            this.invoke(response, 201, res, 'El servicio se creo con exito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al crear el servicio', 500));
        }
    }

    public async updateService(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, description, status, subCategory } = req.body;
        try {
            if (req.file) {
                const pathObject = `${this.path}/${id}/${name}`;
                const { url, success } = await this.s3Service.uploadToS3AndGetUrl(pathObject + ".jpg", req.file, "image/jpeg");
                if (!success) return new ErrorHandler('Hubo un error al subir la imagen', 400)
                const response = await this.servicesUseCase.updateOneService(id, { name, status, description, subCategory, service_image: pathObject, directory: pathObject });
                response.service_image = url;
                this.invoke(response, 201, res, 'El servicio se actualizó con éxito', next);
            } else {
                const response = await this.servicesUseCase.updateOneService(id, { name, status, description, subCategory });
                this.invoke(response, 201, res, 'El servicio se actualizó con éxito', next);
            }
        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al consultar la información', 500));

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
        const { search } = req.query;

        try {
            const response = await this.servicesUseCase.getServices();
            this.invoke(response, 201, res, 'Categoria encontrada', next);
        } catch (error) {
            console.log(error);

            next(new ErrorHandler('', 500));
        }
    }



}


