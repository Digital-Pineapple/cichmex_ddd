import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { BranchOfficeUseCase } from '../../../application/branchOffice/BranchOfficeUseCase';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { ILocation } from '../../../domain/branch_office/BranchOfficeEntity';

export class BranchOfficeController extends ResponseData {
    protected path = '/branch_office';

    constructor(private branchOfficeUseCase: BranchOfficeUseCase,
        private s3Service: S3Service
    ) {
        super();
        this.getAllBranchOffices = this.getAllBranchOffices.bind(this);
        this.getBranchOfficeDetail = this.getBranchOfficeDetail.bind(this);
        this.createBranchOffice = this.createBranchOffice.bind(this);
        this.updateBranchOffice = this.updateBranchOffice.bind(this);
        this.deleteBranchOffice = this.deleteBranchOffice.bind(this);

    }

    public async getAllBranchOffices(req: Request, res: Response, next: NextFunction) {
        const response = await this.branchOfficeUseCase.getAllBranchOffices()
        try {
            const updatedResponse = await Promise.all(
                response?.map(async (item: any) => {
                    const images = item.images;
                    const updatedImages = await Promise.all(
                        images.map(async (image: any) => {
                            const url = await this.s3Service.getUrlObject(
                                image + ".jpg"
                            );
                            return url;
                        })
                    );
                    item.images = updatedImages;
                    return item;
                })
            );

            this.invoke(updatedResponse, 200, res, "", next);
        }
        catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getBranchOfficeDetail(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.branchOfficeUseCase.getDetailBranchOffice(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createBranchOffice(req: Request, res: Response, next: NextFunction) {
        const { user_id, name, description, location, opening_time, closing_time } = req.body;
        try {
            if (req.files) {
                const paths: string[] = [];
                const urls: string[] = [];

                await Promise.all(req.files?.map(async (item: any, index: number) => {
                    const pathObject: string = `${this.path}/${user_id}/${index}`;
                    const { url, success, key } = await this.s3Service.uploadToS3AndGetUrl(
                        pathObject + ".jpg",
                        item,
                        "image/jpeg"
                    );
                    paths.push(pathObject);
                    urls.push(url)
                    if (!success) return new ErrorHandler("Hubo un error al subir la imagen", 400)
                    const response = await this.branchOfficeUseCase.createBranchOffice({ user_id, name, description, location, opening_time, closing_time, images: paths })
                    if (!(response instanceof ErrorHandler)) {
                        response.images = urls;
                    }
                    
                    this.invoke(
                        response,
                        201,
                        res,
                        "Registro exitoso",
                        next)
                }))
            }

            const response = await this.branchOfficeUseCase.createBranchOffice({ user_id, name, description, location, opening_time, closing_time, })
            
            
            this.invoke(
                response,
                201,
                res,
                "Se registró con éxito",
                next
            );




        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al crear', 500));
        }

    }

    public async updateBranchOffice(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const { user_id, description, location, opening_time, closing_time } = req.body;

        if (req.files) {
            const paths: string[] = [];
            const urls: string[] = [];
            await Promise.all(req.files?.map(async (item: any, index: number) => {
                const pathObject: string = `${this.path}/${user_id}/${index}`;
                const { url, success, key } = await this.s3Service.uploadToS3AndGetUrl(
                    pathObject + ".jpg",
                    item,
                    "image/jpeg"
                );
                paths.push(pathObject);
                urls.push(url)
                if (!success) return new ErrorHandler("Hubo un error al subir la imagen", 400)
                const response = await this.branchOfficeUseCase.updateBranchOffice(id, { description, location, opening_time, closing_time, images: paths })
                if (!(response instanceof ErrorHandler)) {
                    response?.images = urls;
                }
                this.invoke(
                    response,
                    201,
                    res,
                    "El usuario se actualizó con éxito",
                    next)
            }))
        }

        const response = await this.branchOfficeUseCase.updateBranchOffice(id, { description:description, location:location, opening_time:opening_time, closing_time:closing_time })
        this.invoke(
            response,
            201,
            res,
            "Se actualizó con éxito",
            next)


    }

    public async deleteBranchOffice(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.branchOfficeUseCase.deleteOneBranchOffice(id)
            this.invoke(response, 201, res, 'Se elimino con exito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error eliminar', 500));
        }
    }




}

