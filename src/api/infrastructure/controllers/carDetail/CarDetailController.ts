import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { CarDetailUseCase } from '../../../application/carDetail/CarDetailUseCase';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';

export class CarDetailController extends ResponseData {
    protected path = '/car-detail';

    constructor(private carDetailUseCase: CarDetailUseCase, private readonly s3Service: S3Service) {
        super();
        this.getAllCarDetails = this.getAllCarDetails.bind(this);
        this.getCarDetail = this.getCarDetail.bind(this);
        this.createCarDetail = this.createCarDetail.bind(this);
        this.updateCarDetail = this.updateCarDetail.bind(this);
        this.deleteCarDetail = this.deleteCarDetail.bind(this);
        this.uploadCarDetailPhoto = this.uploadCarDetailPhoto.bind(this);

    }

    public async getAllCarDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.carDetailUseCase.getAllCarDetail();
            await Promise.all(response.map(async(res)=> {
                const url = await this.s3Service.getUrlObject(res.category_image + ".jpg");
                res.category_image = url
            }))
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getCarDetail(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.carDetailUseCase.getDetailCarDetail(id);
            const url = await this.s3Service.getUrlObject(response?.carDetail_image + ".jpg");
            response.carDetail_image = url
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createCarDetail(req: Request, res: Response, next: NextFunction) {
        const { name, description, status } = req.body;
        try {
            const response = await this.carDetailUseCase.createNewCarDetail(name, description, status);
            this.invoke(response, 201, res, 'La categoria se creo con exito', next);
        } catch (error) {
            console.log(error);

            next(new ErrorHandler('Hubo un error al crear la categoria', 500));
        }
    }

    public async updateCarDetail(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { values } = req.body;
        try {
            if (req.file) {
                const pathObject = `${this.path}/${id}/${name}`;
                const { url, success } = await this.s3Service.uploadToS3AndGetUrl(pathObject + ".jpg", req.file, "image/jpeg");
                if (!success) return new ErrorHandler('Hubo un error al subir la imagen', 400)
                const response = await this.carDetailUseCase.updateOneCarDetail(id,  values );
                response?.carDetail_image = url;
                this.invoke(response, 201, res, 'La categoría se actualizó con éxito', next);     
            } else {
                const response = await this.carDetailUseCase.updateOneCarDetail(id, values);
                this.invoke(response, 201, res, 'La categoría se actualizó con éxito', next);     
            }

        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al actualizar la categoría', 500));
        }
    }

    public async deleteCarDetail(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.carDetailUseCase.deleteOneCarDetail(id);
            this.invoke(response, 201, res, 'Se elimino con exito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error eliminar', 500));
        }
    }

    public async uploadCarDetailPhoto(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { photoFile } = req.body;

        try {
            const pathObject = `${this.path}/${id}/${req.body?.photoFile}`;
            const { message, key, url, success } = await this.s3Service.uploadToS3AndGetUrl(pathObject + ".jpg", photoFile);
            if (!success) return new ErrorHandler('Hubo un error al subir la imagen', 400)
            const response = await this.carDetailUseCase.updateOneCarDetail(key, id);
            console.log(response)
            response?.carDetail_image = url;
            this.invoke(response, 200, res, message, next);
        } catch (error) {
            console.log(error)
            next(new ErrorHandler(`Hubo un error al subir la foto ${error}`, 500));
        }
    }


}

