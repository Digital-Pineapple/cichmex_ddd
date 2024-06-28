import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { CarDetailUseCase } from '../../../application/carDetail/CarDetailUseCase';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { authPopulateConfing, nameCarPopulateConfing } from '../../../../shared/domain/PopulateInterfaces';


export class CarDetailController extends ResponseData {
    protected path = '/car-detail';

    constructor(private carDetailUseCase: CarDetailUseCase, private readonly s3Service: S3Service) {
        super();
        this.getAllCarDetails = this.getAllCarDetails.bind(this);
        this.getCarDetail = this.getCarDetail.bind(this);
        this.createCarDetail = this.createCarDetail.bind(this);
        this.updateCarDetail = this.updateCarDetail.bind(this);
        this.deleteCarDetail = this.deleteCarDetail.bind(this);
        this.getCarDetailByCustomer = this.getCarDetailByCustomer.bind(this);
        this.uploadCarDetailPhoto = this.uploadCarDetailPhoto.bind(this);

    }

    public async getAllCarDetails(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.carDetailUseCase.getAllCarDetail();
                await Promise.all(response?.map(async(res)=> {
                    const url = await this.s3Service.getUrlObject(res.carDetail_image + ".jpg");
                    
                    
                    res.carDetail_image = url
                   
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
           if (response) {
               response.carDetail_image = url
           }
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getCarDetailByCustomer(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.carDetailUseCase.getDetailCarDetailByCustomer(id);
            await Promise.all(response?.map(async(res)=> {
                const url = await this.s3Service.getUrlObject(res.carDetail_image + ".jpg");
                const nameTypeCar = await this.carDetailUseCase.getDetailNameCar( res.typeCar_id );
            
                
                res.carDetail_image = url

            }))
            this.invoke(response, 200, res, '', next);
        } catch (error) {
           
            
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createCarDetail(req: Request, res: Response, next: NextFunction) {
         const { plate_number,customer_id,status, typeCar_id } = req.body;

         
        const ok = await this.carDetailUseCase.getDetailCarDetailByPlateNumber(plate_number, customer_id,);
        try {
            const pathObject = `${this.path}/${customer_id}/${plate_number}`;
            if (ok === null) {
                const { success,url} = await this.s3Service.uploadToS3AndGetUrl(pathObject + ".jpg", req.file, "image/jpeg");
                if (!success) {
                    return new ErrorHandler('Hubo un error', 400);
                }
                const response = await this.carDetailUseCase.createNewCarDetail( plate_number,customer_id,pathObject,status, typeCar_id);
                if (response) {
                    response.carDetail_image = url;
                }
                
                this.invoke(response, 201, res, 'Se creó con éxito', next);
            } else {
                next(new ErrorHandler('Ya existe', 500));
            }
        }
        catch (error) {
          
            next(new ErrorHandler('Hubo un error al crear el auto', 500));
        }



    }

    public async updateCarDetail(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { brand,model,version,plate_number, customer_id } = req.body;

        try {
            if (req.file) {
                const pathObject = `${this.path}/${customer_id}/${plate_number}`;
                const { url, success } = await this.s3Service.uploadToS3AndGetUrl(pathObject + ".jpg", req.file, "image/jpeg");
                if (!success) return new ErrorHandler('Hubo un error al subir la imagen', 400)
                const response = await this.carDetailUseCase.updateOneCarDetail(id,  {brand,model,version,plate_number,customer_id} );
               if (response) {
                response.carDetail_image = url;
               } 
                this.invoke(response, 201, res, 'Se actualizó con éxito', next);     
            } else {
                const response = await this.carDetailUseCase.updateOneCarDetail(id, {brand,model,version,plate_number,customer_id});
                if (response) {
                    const {url} = await this.s3Service.uploadToS3AndGetUrl(response.carDetail_image + ".jpg")
                    response.carDetail_image = url
                }
                this.invoke(response, 201, res, 'Se actualizó con éxito', next);     
            }
        } catch (error) {
       
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
        const { customer_id, plate_number } = req.body;

        try {
            const pathObject = `${this.path}/${customer_id}/${plate_number}`;
            const { message, key, url, success } = await this.s3Service.uploadToS3AndGetUrl(pathObject + ".jpg", req.file);
            if (!success) return new ErrorHandler('Hubo un error al subir la imagen', 400)
            const response = await this.carDetailUseCase.updateOneCarDetail(key, customer_id);
        if (response) {
            response.carDetail_image = url;
        }
            this.invoke(response, 200, res, message, next);
        } catch (error) {
           
            next(new ErrorHandler(`Hubo un error al subir la foto ${error}`, 500));
        }
    }


}

