import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { BranchOfficeUseCase } from '../../../application/branchOffice/BranchOfficeUseCase';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { BranchOfficeResponse, ILocation } from '../../../domain/branch_office/BranchOfficeEntity';
import { DocumentationUseCase } from '../../../application/documentation/DocumentationUseCase';
import mongoose from 'mongoose';
import { ProductOrderUseCase } from '../../../application/product/productOrderUseCase';

export class BranchOfficeController extends ResponseData {
    protected path = '/branch_office';

    constructor(private branchOfficeUseCase: BranchOfficeUseCase,
        private documentationUseCase: DocumentationUseCase,
        private productOrderUseCase : ProductOrderUseCase,
        private s3Service: S3Service
    ) {
        super();
        this.getAllBranchOffices = this.getAllBranchOffices.bind(this);
        this.getBranchOfficesInfo = this.getBranchOfficesInfo.bind(this);
        this.getBranchOfficeDetail = this.getBranchOfficeDetail.bind(this);
        this.getBranchesByUser = this.getBranchesByUser.bind(this);
        this.createBranchOffice = this.createBranchOffice.bind(this);
        this.updateBranchOffice = this.updateBranchOffice.bind(this);
        this.deleteBranchOffice = this.deleteBranchOffice.bind(this);
        this.verifyBranchOffice = this.verifyBranchOffice.bind(this);
        this.desactivateBranchOffice = this.desactivateBranchOffice.bind(this);
    }

    public async getAllBranchOffices(req: Request, res: Response, next: NextFunction) {
        const response: any | null = await this.branchOfficeUseCase.getAllBranchOffices()
        try {
            const updatedResponse = await Promise.all(
                
                response.map(async (item: any) => {
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

    public async getCichmexBranches(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.branchOfficeUseCase;
            this.invoke(response, 200, res, "", next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getBranchOfficesInfo(req: Request, res: Response, next: NextFunction) {
        try {
            // Obtener la información de las sucursales
            const response = await this.branchOfficeUseCase.getInfoBranchOffices();                      
            this.invoke(response, 200, res, "", next);            
        } catch (error) {

        }
    }

    public async getBranchOfficeDetail(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        try {
            const response: any| null = await this.branchOfficeUseCase.getDetailBranchOffice(id);
            const updatedResponse = await Promise.all(
                response.images.map(async (image: any) => {
                    const url = await this.s3Service.getUrlObject(
                        image + ".jpg"
                    );
                    return url
                })
            );
            response.images = updatedResponse;

            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getBranchesByUser(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        try {
            const response: any | null = await this.branchOfficeUseCase.getBranchesUser(id)
            const updatedResponse = await Promise.all(
                response.map(async (item: any) => {
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
            this.invoke(updatedResponse, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    // public async createBranchOffice(req: Request, res: Response, next: NextFunction) {
    //     const { user_id, name, description, phone_number, location, schedules, type } = req.body;
    //      const location1 = JSON.parse(location)
    //      const parseSchedules = JSON.parse(schedules)
    //      console.log(req.body);
         
    //     try {
    //         if (req.files) {
    //             const paths: string[] = [];
    //             const urls: string[] = [];

    //             await Promise.all(req.files.map(async (item: any, index: number) => {
    //                 const pathObject: string = `${this.path}/${user_id}/${index}`;
    //                 const { url, success, key } = await this.s3Service.uploadToS3AndGetUrl(
    //                     pathObject + ".jpg",
    //                     item,
    //                     "image/jpeg"
    //                 );
    //                 paths.push(pathObject);
    //                 urls.push(url)
    //                 if (!success) return new ErrorHandler("Hubo un error al subir la imagen", 400)
                        
    //                 const response = await this.branchOfficeUseCase.createBranchOffice(
    //                     {  
    //                         user_id, 
    //                         name, 
    //                         description, 
    //                         phone_number: phone_number,
    //                         location, 
    //                         schedules: parseSchedules, 
    //                         type,                             
    //                         images: paths, 
    //                         status:true 
    //                     }, location1)
    //                 if (!(response instanceof ErrorHandler)) {
    //                     response.images = urls;
    //                 }

    //                 this.invoke(
    //                     response,
    //                     201,
    //                     res,
    //                     "Registro exitoso",
    //                     next)
    //             }))
    //         }

    //         const response = await this.branchOfficeUseCase.createBranchOffice(
    //             { 
    //                 user_id, 
    //                 name, 
    //                 description, 
    //                 phone_number: phone_number,
    //                 location, 
    //                 schedules: parseSchedules, 
    //                 type 
    //             }, location1)

    //         this.invoke(
    //             response,
    //             201,
    //             res,
    //             "Se registró con éxito",
    //             next
    //         );




    //     } catch (error) {
    //         console.log(error);
            
           
    //         next(new ErrorHandler('Hubo un error al crear', 500));
    //     }

    // }

    public async createBranchOffice(req: Request, res: Response, next: NextFunction) {
        const { name, description, phone_number, location, schedules, type, tag } = req.body; 
        const user = req.user                   
        try {
            // Parse JSON strings
            const user_id = user.id
            const location1 = JSON.parse(location);
            const parseSchedules = JSON.parse(schedules);
            let images: string[] = [];
            let imageUrls: string[] = [];

            if (req.files) {
                // Cast req.files to a more specific type if you know what kind of files are being handled
                const files = req.files as Express.Multer.File[];
    
                // Upload files to S3 and collect URLs
                await Promise.all(files.map(async (file, index) => {
                    const pathObject = `${this.path}/${user_id}/${index}`;
                    const { url, success, key } = await this.s3Service.uploadToS3AndGetUrl(
                        `${pathObject}.jpg`,
                        file,
                        'image/jpeg'
                    );
    
                    if (!success) {
                        throw new ErrorHandler('Hubo un error al subir la imagen', 400);
                    }
    
                    images.push(pathObject);
                    imageUrls.push(url);
                }));
            }
    
            // Create branch office entry
            const response = await this.branchOfficeUseCase.createBranchOffice(
                {  
                    user_id, 
                    name, 
                    description, 
                    phone_number,
                    location, 
                    schedules: parseSchedules, 
                    type,                             
                    images, 
                    status: true,
                    tag: tag ?? null                                  
                }, 
                location1
            );
    
            if (response instanceof ErrorHandler) {
                return next(response);
            }
    
            // Update response with image URLs
            response.images = imageUrls;
    
            // Send success response
            this.invoke( response, 201, res, "Registro exitoso", next);
        } catch (error) {
            console.error(error);
            next(new ErrorHandler('Hubo un error al crear', 500));
        }
    }
    

    public async addServices(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const { services } = req.body;
        try {
            const response = await this.branchOfficeUseCase
            this.invoke( response, 201, res, "Se registró con éxito", next);
        } catch (error) {              
            next(new ErrorHandler('Hubo un error al crear', 500));
        }

    }

    public async updateBranchOffice(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { description, phone_number, location, name, schedules, type } = req.body;
        const parsedSchedules = JSON.parse(schedules);
        const user = req.user;
        try {           
            const user_id = user.id
            // Verificar si existen archivos adjuntos
            if (req.files && Array.isArray(req.files)) {
                const paths: string[] = [];
                const urls: string[] = [];

                // Subir archivos a S3 y obtener las URLs
                await Promise.all(req.files.map(async (file: any, index: number) => {
                    const pathObject: string = `${this.path}/${user_id}/${index}`;
                    const { url, success, key } = await this.s3Service.uploadToS3AndGetUrl(
                        pathObject + ".jpg",
                        file,
                        "image/jpeg"
                    );

                    if (!success) {
                        throw new ErrorHandler("Hubo un error al subir la imagen", 400);
                    }

                    paths.push(pathObject);
                    urls.push(url);
                }));

                // Actualizar la sucursal de la oficina con las URLs de las imágenes
                const response : any = await this.branchOfficeUseCase.updateBranchOffice(id, {
                    name: name,
                    type: type,
                    description: description,
                    phone_number: phone_number,
                    schedules: parsedSchedules,                  
                    location: location, 
                    images: paths, // Se usan las rutas de los archivos en S3
                });

                // Asignar las URLs de las imágenes a la respuesta
                if (!(response instanceof ErrorHandler && response !== null)) {
                    response.images = urls;
                }

                // Enviar la respuesta al cliente
                this.invoke(response, 201, res, "El usuario se actualizó con éxito", next);
            } else {
                // Si no hay archivos adjuntos, simplemente actualizar la sucursal de la oficina
                const response = await this.branchOfficeUseCase.updateBranchOffice(id, {
                    name: name,
                    type: type,
                    description: description,  
                    phone_number: phone_number,                  
                    schedules: parsedSchedules,
                    location: location,
                });

                // Enviar la respuesta al cliente
                this.invoke(response, 201, res, "Se actualizó con éxito", next);
            }
        } catch (error) {
            // Manejar cualquier error que ocurra durante el proceso
            this.invoke(error, 500, res, "Error interno del servidor", next);
        }
    }


    public async deleteBranchOffice(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        
        try {
            const noProductOrders = await this.productOrderUseCase.ProductOrdersByBranch(id);
            
            if (noProductOrders!== null ) {
                try {
                    const response = await this.branchOfficeUseCase.deleteOneBranchOffice(id);
                    this.invoke(response, 201, res, 'Se eliminó con éxito', next);
                } catch (error) {
                    next(new ErrorHandler('Hubo un error al eliminar la sucursal', 500));
                }
            } else {
                next(new ErrorHandler('No se puede eliminar la sucursal porque tiene pedidos asociados', 400));
            }
        } catch (error) {
            next(new ErrorHandler('Hubo un error al verificar los pedidos de la sucursal', 500));
        }
    }
    


    public async verifyBranchOffice(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { user_id } = req.body
        try {          
           const response = await this.branchOfficeUseCase.validateBranchOffice(id, { activated: true })
           this.invoke(response, 201, res, 'Activación exitosa', next);          
        } catch (error) {        
            next(new ErrorHandler('Error', 500));
        }
    }

    public async desactivateBranchOffice(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.branchOfficeUseCase.validateBranchOffice(id, { activated: false });
            this.invoke(response, 200, res, 'Desactivación exitosa', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al desactivar la sucursal', 500));
        }
    }




}

