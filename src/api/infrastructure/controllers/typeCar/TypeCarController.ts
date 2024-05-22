import { Request, Response, NextFunction, response } from 'express';

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
            if (response !== null) {
                await Promise.all(response.map(async (res) => {
                    const url = await this.s3Service.getUrlObject(res.typeCar_image + ".jpg");
                    res.typeCar_image = url;
                }));
                this.invoke(response, 200, res, '', next);
            }
            else{
                this.invoke(response, 200, res, '', next);
            }
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getTypeCar(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
           const response = await this.typeCarUseCase.getTypeCar(id);
           const url = await this.s3Service.getUrlObject(response?.typeCar_image + ".jpg");
               response.typeCar_image = url;
               this.invoke(response,200,res,"", next)
          
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createTypeCar(req: Request, res: Response, next: NextFunction) {
        const { name } = req.body;
        try {
            const response = await this.typeCarUseCase.createNewTypeCar(name);
            this.invoke(response, 200, res, '', next)
        } catch (error) {
            console.log(error)
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async updateTypeCar(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, status } = req.body;
        try {
            if (req.file) {
                const pathObject = `${this.path}/${id}/${name}`;
                const { url, success } = await this.s3Service.uploadToS3AndGetUrl(pathObject + ".jpg", req.file, "image/jpeg");
                if (!success) return new ErrorHandler('Hubo un error al subir la imagen', 400)
                const response = await this.typeCarUseCase.updateTypeCar(id, {name, typeCar_image:pathObject});
            if (!(response instanceof ErrorHandler) && response !== null) { 
                response.typeCar_image = url;
                this.invoke(response, 201, res, 'El tipo de auto se actualizó con éxito', next);
            }
            }else{
            const response = await this.typeCarUseCase.updateTypeCar(id,{name,status})
            this.invoke(response, 201, res, 'El tipo de auto se actualizó con éxito', next);
            }
        } catch (error) {
            console.log(error);
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