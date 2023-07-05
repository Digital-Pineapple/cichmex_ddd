import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { CategoryUseCase } from '../../../application/category/CategoryUseCase';


export class CategoryController extends ResponseData {

    constructor(private categoryUseCase:CategoryUseCase  ) {
        super();
        this.getAllCategories    =   this.getAllCategories.bind(this);
        this.getCategory         =   this.getCategory.bind(this);
        this.createCategory      =   this.createCategory.bind(this);
        this.updateCategory      =   this.updateCategory.bind(this);
        this.deleteCategory      =   this.deleteCategory.bind(this);
        this.searchCategory    =   this.searchCategory.bind(this);
    }

    public async getAllCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.categoryUseCase.getCategories();
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getCategory(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.categoryUseCase.getDetailCategory(id);
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createCategory(req: Request, res: Response, next: NextFunction) {
        const { name, description, status } = req.body;
        try {
            const response = await this.categoryUseCase.createNewCategory(name, description,status);
            this.invoke(response, 201, res, 'La categoria se creo con exito', next);
        } catch (error) {
            console.log(error);
            
            next(new ErrorHandler('Hubo un error al crear la categoria', 500));
        }
    }

    public async updateCategory(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, description, status } = req.body;
        try {
            const response = await this.categoryUseCase.updateOneCategory(id, { name, description, status });
            this.invoke(response, 201, res, 'La categoria se actualizó con exito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al actualizar el servicio', 500));   
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
        const {search } = req.query;
        console.log(req.query);
        
        try {
            const response = await this.categoryUseCase.searchCategory(search);
            this.invoke(response, 201, res, 'Categoria encontrada', next);
        } catch (error) {
            console.log(error);
            
            next(new ErrorHandler('Hubo un error eliminar la categori', 500));   
        }
    }


}

