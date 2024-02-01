import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { CategoryUseCase } from '../../../application/category/CategoryUseCase';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';

export class CategoryController extends ResponseData {
    protected path = '/categories';

    constructor(private categoryUseCase: CategoryUseCase, private readonly s3Service: S3Service) {
        super();
        this.getAllCategories = this.getAllCategories.bind(this);
        this.getCategory = this.getCategory.bind(this);
        this.createCategory = this.createCategory.bind(this);
        this.updateCategory = this.updateCategory.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
        this.searchCategory = this.searchCategory.bind(this);
        this.uploadCategoryPhoto = this.uploadCategoryPhoto.bind(this);
      

    }

    public async getAllCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.categoryUseCase.getCategories();
            if (!(response instanceof ErrorHandler) && response !==null) {     
                await Promise.all(response.map(async(res)=> {
                    const url = await this.s3Service.getUrlObject(res.category_image + ".jpg");
                    res.category_image = url
                }))
                this.invoke(response, 200, res, '', next);
            }
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

   


    public async getCategory(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.categoryUseCase.getDetailCategory(id);
            const url = await this.s3Service.getUrlObject(response?.category_image + ".jpg");
            response.category_image = url
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createCategory(req: Request, res: Response, next: NextFunction) {
        const { name } = req.body;
        
       
        try {
            const response = await this.categoryUseCase.createNewCategory(name);
            this.invoke(response, 201, res, 'La categoria se creo con exito', next);
        } catch (error) {
            console.log(error);

            next(new ErrorHandler('Hubo un error al crear la categoria', 500));
        }
    }

    public async updateCategory(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name } = req.body;
        try {
            if (req.file) {
                const pathObject = `${this.path}/${id}/${name}`;
                const { url, success } = await this.s3Service.uploadToS3AndGetUrl(pathObject + ".jpg", req.file, "image/jpeg");
                if (!success) return new ErrorHandler('Hubo un error al subir la imagen', 400)
                const response = await this.categoryUseCase.updateOneCategory(id, { name, category_image: pathObject });
                response.category_image = url;
                this.invoke(response, 201, res, 'La categoría se actualizó con éxito', next);     
            } else {
                const response = await this.categoryUseCase.updateOneCategory(id, { name});
                this.invoke(response, 201, res, 'La categoría se actualizó con éxito', next);     
            }

        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al actualizar la categoría', 500));
        }
    }

    public async deleteCategory(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.categoryUseCase.deleteOneCategory(id);
            this.invoke(response, 201, res, 'La categoria se elimino con exito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error eliminar la categoria', 500));
        }
    }
    public async searchCategory(req: Request, res: Response, next: NextFunction) {
        const { search } = req.query;

        try {
            const response = await this.categoryUseCase.getCategories();
            this.invoke(response, 201, res, 'Categoria encontrada', next);
        } catch (error) {
            console.log(error);

            next(new ErrorHandler('No se encontro la categoria', 500));
        }
    }

    public async uploadCategoryPhoto(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { photoFile } = req.body;

        try {
            const pathObject = `${this.path}/${id}/${req.body?.photoFile}`;
            const { message, key, url, success } = await this.s3Service.uploadToS3AndGetUrl(pathObject + ".jpg", photoFile);
            if (!success) return new ErrorHandler('Hubo un error al subir la imagen', 400)
            const response = await this.categoryUseCase.updateOneCategory(key, {});
            console.log(response)
            response.category_image = url;
            this.invoke(response, 200, res, message, next);
        } catch (error) {
            console.log(error)
            next(new ErrorHandler(`Hubo un error al subir la foto $(error)`, 500));
        }
    }


}

