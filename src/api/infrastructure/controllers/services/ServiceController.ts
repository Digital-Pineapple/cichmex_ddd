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
            
            const response : any = await this.servicesUseCase.getServices();
            await Promise.all(response.map(async (res:any) => {
                
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
            const response : any = await this.servicesUseCase.getDetailService(id);
            const url = await this.s3Service.getUrlObject(response.image + ".jpg");
            response.image = url;
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createService(req: Request, res: Response, next: NextFunction) {
        const { name, description, subCategory } = req.body;
        
        try {
            const response : any = await this.servicesUseCase.createNewService({name:name,description:description,subCategory:subCategory});
    
            if (response instanceof ErrorHandler || response === null) {
                return this.invoke(response, 400, res, 'Hubo un error al crear ', next);
            }
    
            if (req.file) {
                const pathObject = `${this.path}/${response._id}/${name}`;
                const { url, success } = await this.s3Service.uploadToS3AndGetUrl(pathObject + ".jpg", req.file, "image/*");
    
                if (!success) {
                    return next(new ErrorHandler('Hubo un error al subir la imagen', 400));
                }
    
                const update = await this.servicesUseCase.updateOneService(response._id ,{image:pathObject})
    
                if (update !== null) {
                    update.image = url;
                    return this.invoke(update, 201, res, 'Se creó con éxito - imagen', next);
                }
            }
    
            return this.invoke(response, 201, res, 'Se creó con éxito', next);
    
        } catch (error) {
            return next(new ErrorHandler('Hubo un error al crear', 500));
        }
    }

    public async updateService(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, description, subCategory } = req.body;
        
        try {
            if (req.file) {
                const pathObject = `${this.path}/${id}/${name}`;
                const { url, success, key } = await this.s3Service.uploadToS3AndGetUrl(pathObject + ".jpg", req.file, "image/*");
                
                if (!success) return new ErrorHandler('Hubo un error al subir la imagen', 400)
                const response = await this.servicesUseCase.updateOneService(id, { name, description, subCategory, image: pathObject, directory: pathObject });
                response.image = url;
                this.invoke(response, 201, res, 'El servicio se actualizó con éxito', next);
            } else {
                const response = await this.servicesUseCase.updateOneService(id, { name, description, subCategory });
                this.invoke(response, 201, res, 'El servicio se actualizó con éxito', next);
            }
        } catch (error) {
          
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
            

            next(new ErrorHandler('', 500));
        }
    }



}


