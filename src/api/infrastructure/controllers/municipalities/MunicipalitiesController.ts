import { Request, Response, NextFunction } from 'express';
import { MunicipalitiesUseCase } from '../../../application/municipalities/MunicipalitiesUseCase';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';

// Controlador para manejar las municipalidades
export class MunicipalitiesController extends ResponseData {
    constructor(private municipalitiesUseCase: MunicipalitiesUseCase) {
        super();
        this.getAllMunicipalities = this.getAllMunicipalities.bind(this);
        this.getOneMunicipality = this.getOneMunicipality.bind(this);
        this.createMunicipality = this.createMunicipality.bind(this);
        this.updateMunicipality = this.updateMunicipality.bind(this);
        this.deleteMunicipality = this.deleteMunicipality.bind(this);
        this.getMunicipalitiesByState = this.getMunicipalitiesByState.bind(this);
    }

    // Método para obtener todas las municipalidades
    public async getAllMunicipalities(req: Request, res: Response, next: NextFunction) {
        try {
            const municipalities = await this.municipalitiesUseCase.getAllMunicipalities();
            this.invoke(municipalities, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Error fetching municipalities', 500));
        }
    }

    // Método para obtener una municipalidad por su ID
    public async getOneMunicipality(req: Request, res: Response, next: NextFunction) {
        try {
            const municipality = await this.municipalitiesUseCase.getOneMunicipality(req.params.id);
            this.invoke(municipality, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Error fetching municipality', 500));
        }
    }

    // Método para crear una nueva municipalidad
    public async createMunicipality(req: Request, res: Response, next: NextFunction) {
        try {
            const municipality = await this.municipalitiesUseCase.createMunicipality(req.body);
            this.invoke(municipality, 201, res, 'Municipality created successfully', next);
        } catch (error) {
            next(new ErrorHandler('Error creating municipality', 500));
        }
    }

    // Método para actualizar una municipalidad
    public async updateMunicipality(req: Request, res: Response, next: NextFunction) {
        try {
            const municipality = await this.municipalitiesUseCase.updateMunicipality(req.params.id, req.body);
            this.invoke(municipality, 200, res, 'Municipality updated successfully', next);
        } catch (error) {
            next(new ErrorHandler('Error updating municipality', 500));
        }
    }

    // Método para eliminar una municipalidad
    public async deleteMunicipality(req: Request, res: Response, next: NextFunction) {
        try {
            await this.municipalitiesUseCase.deleteMunicipality(req.params.id);
            this.invoke(null, 204, res, 'Municipality deleted successfully', next);
        } catch (error) {
            next(new ErrorHandler('Error deleting municipality', 500));
        }
    }

    // Método para obtener las municipalidades por un estado específico
    public async getMunicipalitiesByState(req: Request, res: Response, next: NextFunction) {
        try {
            const { stateId } = req.params;
            if (!stateId) {
                return next(new ErrorHandler('id del estado requerido', 404));
            }            
            console.log('stateId', stateId);            
            const municipalities = await this.municipalitiesUseCase.getMunicipalitiesByState(stateId);
            this.invoke(municipalities, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Error fetching municipalities by state', 500));
        }
    }
}
