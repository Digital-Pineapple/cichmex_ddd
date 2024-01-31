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
        // this.searchSubCategory    =   this.searchSubCategory.bind(this);
        this.findSubCategoriesByCategory  = this.findSubCategoriesByCategory.bind(this);
    
    }

    public async getAllSubCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.subCategoryUseCase.getSubCategories();
            await Promise.all(response.map(async (res) => {
                const url = await this.s3Service.getUrlObject(res.typeCar_image + ".jpg");
                res.subCategory_image = url;
            }));
            this.invoke(response, 200, res, '', next);
            
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
  
    public async getSubCategory(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.subCategoryUseCase.getDetailSubCategory(id);
            const url = await this.s3Service.getUrlObject(response?.subCategory_image + ".jpg");
            response ? response.subCategory_image = url: null;
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createSubCategory(req: Request, res: Response, next: NextFunction) {
        const { name, category_id } = req.body;
        
        try {
            const response = await this.subCategoryUseCase.createNewSubCategory(name, category_id);
            this.invoke(response, 201, res, 'La subcategoria se creo con exito', next);
        } catch (error) {
            console.log(error);
            
            next(new ErrorHandler('Hubo un error al crear la subcategoria', 500));
        }
    }

    public async updateSubCategory(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, category_id } = req.body;
        
        try {
            if (req.file) {
                const pathObject = `${this.path}/${id}/${name}`;
                const { url, success,key } = await this.s3Service.uploadToS3AndGetUrl(pathObject + ".jpg", req.file, "image/jpeg");
                if (!success) return new ErrorHandler('Hubo un error al subir la imagen', 400)
                const response = await this.subCategoryUseCase.updateOneSubCategory(id,{subCategory_image:pathObject,name,category_id})
            if (!(response instanceof ErrorHandler)) { 
                response.subCategory_image  = url;
                this.invoke(response, 201, res, 'La subcategoría se actualizó con éxito', next);
            }
            }else{
                const response = await this.subCategoryUseCase.updateOneSubCategory(id, {name, category_id });
            this.invoke(response, 201, res, 'La subcategoría se actualizó con éxito', next);
            }
        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
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
    // public async searchSubCategory(req: Request, res: Response, next: NextFunction) {
    //     const {search} = req.query;
    //     console.log(req.query);
        
    //     try {
    //         const response = await this.subCategoryUseCase.searchSubCategory(search);
    //         this.invoke(response, 201, res, 'Subcategoria encontrada', next);
    //     } catch (error) {
    //         console.log(error);
            
    //         next(new ErrorHandler('No se encontro la Subcategoria', 500));   
    //     }
    // }
    public async findSubCategoriesByCategory (req: Request, res: Response, next: NextFunction) {
        const {id} = req.params;
        try {
            
            const response = await this.subCategoryUseCase.getSubCtegoriesByCategoryId(id)
            this.invoke(response, 201, res, 'Subcategoria encontrada', next);
        } catch (error) {
            console.log(error);
            
            next(new ErrorHandler('No se encontro la Subcategoria', 500));   
        }
    }


    }