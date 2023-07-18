import { Request, Response, NextFunction } from 'express';

import { ResponseData } from "../../../../shared/infrastructure/validation/ResponseData";

import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { TypeCarUseCase } from '../../../application/typeCar/TypeCarUseCase';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';

export class TypeCarController extends ResponseData {
    protected path = '/type-car'

    constructor(private typeCarUseCase: TypeCarUseCase,  private readonly s3Service: S3Service) {
        super();
        this.getAllTypeCars = this.getAllTypeCars.bind(this);
        this.getTypeCar     = this.getTypeCar.bind(this);
        this.createTypeCar  = this.createTypeCar.bind(this);
        this.updateTypeCar  = this.updateTypeCar.bind(this);
        this.deleteTypeCar  = this.deleteTypeCar.bind(this);
    }

    public async getAllTypeCars(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.typeCarUseCase.getTypeCars();
            this.invoke(response, 200, res, '', next)
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getTypeCar(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.typeCarUseCase.getTypeCar(id);
            this.invoke(response, 200, res, '', next)
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createTypeCar(req: Request, res: Response, next: NextFunction) {
        const { name } = req.body;
        try {
            const response = await this.typeCarUseCase.createNewTypeCar({ name });
            this.invoke(response, 200, res, '', next)
        } catch (error) {
            console.log(error)
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async updateTypeCar(req: Request, res: Response, next: NextFunction) {
        const { name } = req.body;
        const { id } = req.params;
        try {
            const pathObject = `${this.path}/${id}/${req.file?.fieldname}`;

            const { message, key, url, success } = await this.s3Service.uploadToS3AndGetUrl(pathObject, req.file, "image/jpeg");
            if (!success) return new ErrorHandler('Hubo un error al subir la imagen', 400)
            const response = await this.typeCarUseCase.updateTypeCar(id, { name, typeCar_image: key, });
            console.log(response)
            response.typeCar_image = url;
            this.invoke(response, 201, res, 'La categoría se actualizó con éxito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }


    public async deleteTypeCar(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.typeCarUseCase.deleteTypeCar(id);
            this.invoke(response, 200, res, '', next)
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

}