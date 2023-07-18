import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { SubCategoryUseCase } from '../../../application/subCategory/SubCategoryUseCase';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';




export class SubCategoryController extends ResponseData {
    protected path = '/subCategories';
    constructor(private subCategoryUseCase:SubCategoryUseCase, private readonly s3Service:S3Service  ) {
        super();
        this.getAllSubCategories    =   this.getAllSubCategories.bind(this);
        this.getSubCategory         =   this.getSubCategory.bind(this);
        this.createSubCategory      =   this.createSubCategory.bind(this);
        this.updateSubCategory      =   this.updateSubCategory.bind(this);
        this.deleteSubCategory      =   this.deleteSubCategory.bind(this);
        this.searchSubCategory    =   this.searchSubCategory.bind(this);
    }

    public async getAllSubCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.subCategoryUseCase.getSubCategories();
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getSubCategory(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.subCategoryUseCase.getDetailSubCategory(id);
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createSubCategory(req: Request, res: Response, next: NextFunction) {
        const { name, description, status, category } = req.body;
        try {
            const response = await this.subCategoryUseCase.createNewSubCategory(name, description,status, category);
            this.invoke(response, 201, res, 'La subcategoria se creo con exito', next);
        } catch (error) {
            console.log(error);
            
            next(new ErrorHandler('Hubo un error al crear la subcategoria', 500));
        }
    }

    public async updateSubCategory(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, description, status, category } = req.body;
        try {
            const pathObject = `${this.path}/${id}/${req.file?.fieldname}`;

            const { message, key, url, success } = await this.s3Service.uploadToS3AndGetUrl(pathObject, req.file, "image/jpeg");
            if (!success) return new ErrorHandler('Hubo un error al subir la imagen', 400)
            const response = await this.subCategoryUseCase.updateOneSubCategory(id, { name, description, status, category , subCategory_image: key });
            console.log(response)
            response.category_image = url;
            this.invoke(response, 201, res, 'La categoría se actualizó con éxito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al actualizar la subcategoria', 500));   
        }
    }

    public async deleteSubCategory(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.subCategoryUseCase.deleteOneSubCategory(id);
            this.invoke(response, 201, res, 'La subcategoria se elimino con exito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error eliminar la subcategoria', 500));   
        }
    }
    public async searchSubCategory(req: Request, res: Response, next: NextFunction) {
        const {search} = req.query;
        console.log(req.query);
        
        try {
            const response = await this.subCategoryUseCase.searchSubCategory(search);
            this.invoke(response, 201, res, 'Subcategoria encontrada', next);
        } catch (error) {
            console.log(error);
            
            next(new ErrorHandler('No se encontro la Subcategoria', 500));   
        }
    }


}

