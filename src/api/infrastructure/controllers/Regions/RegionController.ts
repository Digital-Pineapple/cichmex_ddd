import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { RegionUseCase } from '../../../application/regions/regionUseCase';


export class RegionController extends ResponseData {
    protected path = '/region';

    constructor(private regionUseCase: RegionUseCase) {
        super();
        this.getAllRegions = this.getAllRegions.bind(this);
        this.getOneRegion = this.getOneRegion.bind(this);
        this.createRegion = this.createRegion.bind(this);
        this.updateRegion = this.updateRegion.bind(this);
        this.deteleRegion = this.deteleRegion.bind(this);
    }

    public async getAllRegions(req: Request, res: Response, next: NextFunction) {
        try {
            const response : any = await this.regionUseCase.getAllRegions()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getOneRegion(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params
        try {
            const response : any = await this.regionUseCase.getOneRegion(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            console.log(error
            );
            
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async createRegion(req: Request, res: Response, next: NextFunction) {
        const {values} = req.body
        try {
            const response : any = await this.regionUseCase.createRegion(values)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            console.log(error);
            
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async updateRegion(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params
        const {values} = req.body
        console.log(values);
        
        try {
            const response : any = await this.regionUseCase.updateRegion(id,values)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async deteleRegion(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params
        try {
            const response : any = await this.regionUseCase.deleteRegion(id)
            this.invoke(response, 200, res, 'Se elimino correctamente', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }


}

