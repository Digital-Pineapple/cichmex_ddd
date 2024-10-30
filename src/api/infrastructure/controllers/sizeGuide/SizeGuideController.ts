import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { SizeGuideUseCase } from '../../../application/sizeGuide/SizeGuideUseCase';


export class SizeGuideController extends ResponseData {
    protected path = '/sizeGuides';

    constructor(
        private sizeGuideUseCase: SizeGuideUseCase,
       
    ) {
        super();
        this.getMySizeGuides = this.getMySizeGuides.bind(this);
        this.getOneGuide = this.getOneGuide.bind(this);
        this.createOneGuide = this.createOneGuide.bind(this);
        this.updateOneGuide = this.updateOneGuide.bind(this);
        this.deleteOneGuide = this.deleteOneGuide.bind(this);
        
    }

    public async getMySizeGuides(req: Request, res: Response, next: NextFunction) {
        const { id } = req.user;
    
        try {
            if (!id) {
                return next(new ErrorHandler('No tiene los permisos necesarios', 403));
            }
            const response = await this.sizeGuideUseCase.getAllMyGuides(id);
            return this.invoke(response, 200, res, '', next);
        } catch (error) {
            return next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getOneGuide(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
    
        try {
            const response = await this.sizeGuideUseCase.getAllMyGuides(id);
            return this.invoke(response, 200, res, '', next);
        } catch (error) {
            return next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async createOneGuide(req: Request, res: Response, next: NextFunction) {
        const { id } = req.user;
        const { values } = req.body   
        console.log(values);
        
        const sizeGuide = {
            name: values.name,
            dimensions: values.dimensions,
            user_id : id,
            unit: 'cm',
        }
        
         
        try {
            const response = await this.sizeGuideUseCase.createOneGuide({...sizeGuide})
            return this.invoke(response, 200, res, 'Creado con éxito', next);
        } catch (error) {
            return next(new ErrorHandler('Hubo un error ', 500));
        }
    }

    public async updateOneGuide(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const { values } = req.body   

        try {
            const response = await this.sizeGuideUseCase.updateOneGuide(id, {...values})
            return this.invoke(response, 200, res, 'Editado correctamente', next);
        } catch (error) {
            return next(new ErrorHandler('Hubo un error ', 500));
        }
    }
    public async deleteOneGuide(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params

        try {
            const response = await this.sizeGuideUseCase.deleteOneGuide(id)
            return this.invoke(response, 200, res, 'Se eliminó correctamente', next);
        } catch (error) {
            return next(new ErrorHandler('Hubo un error ', 500));
        }
    }
  
    




}
