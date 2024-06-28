import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { DocumentationUseCase } from '../../../application/documentation/DocumentationUseCase';
import { IRespFile } from '../../../domain/documentation/DocumentationsEntity';


export class DocumentationController extends ResponseData {

    protected path = '/documentation';

    constructor(private documentationUseCase: DocumentationUseCase, private readonly s3Service: S3Service) {
        super();
        this.getAllDocumentations = this.getAllDocumentations.bind(this);
        this.createDocumentation = this.createDocumentation.bind(this);
        this.getDocumentationDetail = this.getDocumentationDetail.bind(this);
        this.updateDocumentation = this.updateDocumentation.bind(this);
        this.deleteDocumentation = this.deleteDocumentation.bind(this);
        this.getAllDocumentationsByCustomer = this.getAllDocumentationsByCustomer.bind(this);
        this.validateDocumentation = this.validateDocumentation.bind(this);


    }

    public async getAllDocumentations(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.documentationUseCase.getDocumentations();
            await Promise.all(response?.map(async (res: any) => {
                const url = await this.s3Service.getUrlObject(res.url + ".pdf");
                res.url = url;
            }));
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getDocumentationDetail(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const documentation = await this.documentationUseCase.getDetailDocumentation(id);
            const url = await this.s3Service.getUrlObject(documentation?.url + ".pdf");
            if (documentation !== null) {
                
                documentation.url = url;
                this.invoke(documentation, 200, res, '', next)
            }
            return this.invoke(documentation,200,res,'',next)
        } catch (error) {
            next(new ErrorHandler('Error al encontrar la documentacion', 404));
        }
    }

    public async createDocumentation(req: Request, res: Response, next: NextFunction) {

        const { user_id, name, message, verify } = req.body;

        const noRepeat = await this.documentationUseCase.getDocumentByNameAndCustomer(user_id, name);
        try {
            const pathObject = `${this.path}/${user_id}/${name}`;
            if (noRepeat !== null && !(noRepeat instanceof ErrorHandler)) {

                const { success,url } = await this.s3Service.uploadToS3AndGetUrl(pathObject + ".pdf", req.file, "application/pdf");
                if (!success) {
                    return new ErrorHandler('Hubo un error al subir el documento', 400);
                }
                const file = await this.documentationUseCase.createNewDocumentation(name, message, user_id,pathObject, verify);
                if (file !== null && !(file instanceof ErrorHandler)) {     
                    file.url = url
                }
                this.invoke(file, 201, res, 'El documento se creó con éxito', next);
            } else {

                next(new ErrorHandler('El documento ya existe', 500));
            }


        }
        catch (error) {
           
            next(new ErrorHandler('Hubo un error al crear el documento', 500));
        }



    }
    
    public async updateDocumentation(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, status, message, verify } = req.body;

        try {
            const pathObject = `${this.path}/${id}/${name}`;
            const { success, url, } = await this.s3Service.uploadToS3AndGetUrl(pathObject + ".pdf", req.file, "application/pdf");
            if (!success) return new ErrorHandler('Hubo un error al subir el documento', 400)
            const documentation = await this.documentationUseCase.updateOneDocumentation(id, { name, status, message, verify, url: pathObject });
               documentation.url = url
               this.invoke(documentation, 200, res, 'La documentacion se actualizó con éxito', next);
        } catch (error) {
          
            next(new ErrorHandler('Hubo un error al actualizar la documentación', 500));
        }
    }


    public async deleteDocumentation(req: Request, res: Response, next: NextFunction) {

        const { id } = req.params;

        try {
            const documentation = await this.documentationUseCase.updateOneDocumentation(id, { status: false });
            this.invoke(documentation, 200, res, 'La documentación ha sido eliminado', next);
        } catch (error) {
           
            next(new ErrorHandler('Hubo un error al eliminar la documentación', 500));
        }

    }

    public async getAllDocumentationsByCustomer(req: Request, res: Response, next: NextFunction) {
        const {id } = req.params;
        try {
             const response = await this.documentationUseCase.getDocumentationByUser(id);
             if (!(response instanceof ErrorHandler)) {
                
                 await Promise.all(response != null ? response.map(async (res:any) => {
                     const url = await this.s3Service.getUrlObject(res.url + ".pdf");
                     res.url = url;
                 }):'');
                return this.invoke(response, 200, res, '', next);
             }
            return this.invoke(response,200,res,'', next)
             
        } catch (error) {
  
            

            next(new ErrorHandler(`Hubo un error: ${error}`, 500));
        }
    }

    public async validateDocumentation(req: Request, res: Response, next: NextFunction) {
        const { id, message, verify } = req.body;
        
        const info = await this.documentationUseCase.getDetailDocumentation(id)
        if (info !== null ) {
                const documentation = await this.documentationUseCase.updateOneDocumentation(id, { verify, message })
                if (documentation !== null) {
                    this.invoke(documentation, 201, res, "Se valido con éxito", next)
                }
        }else{
            next(new ErrorHandler(`Hubo un error `, 500));
        }

    }
}