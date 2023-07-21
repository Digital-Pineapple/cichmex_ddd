import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';

import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { DocumentationUseCase } from '../../../application/documentation/DocumentationUseCase';
import { IFile } from '../../../domain/documentation/DocumentationsEntity';

export class DocumentationController extends ResponseData {

    protected path = '/documentation';

    constructor(private documentationUseCase: DocumentationUseCase, private readonly s3Service: S3Service) {
        super();
        this.getAllDocumentations = this.getAllDocumentations.bind(this);
        this.createDocumentation = this.createDocumentation.bind(this);
        this.getDocumentationDetail = this.getDocumentationDetail.bind(this);
        this.updateDocumentation = this.updateDocumentation.bind(this);
        this.deleteDocumentation = this.deleteDocumentation.bind(this);
    
        
    }

    public async getAllDocumentations(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.documentationUseCase.getDocumentations();
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getDocumentationDetail(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        try {
            const documentation = await this.documentationUseCase.getDetailDocumentation(id);
            documentation.url = await this.s3Service.getUrlObject(documentation?.url + ".pdf")
            this.invoke(documentation, 200, res, '', next)
        } catch (error) {
            next(new ErrorHandler('Error al encontrar la documentacion', 404));
        }
    }

    public async createDocumentation(req: Request, res: Response, next: NextFunction) {
    
        const { customer_id, name, status, message } = req.body;
    
        
        try {
            const pathObject = `${this.path}/${customer_id}/${req.file?.fieldname}`;
            
            const {  key, success,url, } = await this.s3Service.uploadToS3AndGetUrl(pathObject, req.file, "application/pdf");
            if (!success) return new ErrorHandler('Hubo un error al subir el documento', 400)

            const file = await this.documentationUseCase.createNewDocumentation(name,message,status,customer_id, url);
            this.invoke(file, 201, res, 'El documento se creó con éxito', next);
            console.log(file);
            
        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al crear el documento', 500));
        }
    }
    
    
    public async updateDocumentation(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { customer_id, ine, curp, prook_address, criminal_record } = req.body;

        try {
            const documentation = await this.documentationUseCase.updateOneDocumentation(id, { customer_id, ine, curp, prook_address, criminal_record });
            this.invoke(documentation, 200, res, 'La documentacion se actualizó con éxito', next);
        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al actualizar la documentación', 500));
        }
    }


    public async deleteDocumentation(req: Request, res: Response, next: NextFunction) {

        const { id } = req.params;

        try {
            const documentation = await this.documentationUseCase.updateOneDocumentation(id, { status: false });
            this.invoke(documentation, 200, res, 'La documentación ha sido eliminado', next);
        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al eliminar la documentación', 500));
        }

    }


    public async getAllDocumentationsByCustomer(req: Request, res: Response, next: NextFunction) {
        const { customer_id } = req.params;
        try {
            const documentations = await this.documentationUseCase.getDocumentationByCustomer(customer_id);
            this.invoke(documentations, 200, res, '', next);
        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al consultar la documentacion', 500));
        }
    }

}