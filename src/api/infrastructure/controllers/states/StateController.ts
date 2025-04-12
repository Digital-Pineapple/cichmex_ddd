import { Request, Response, NextFunction } from 'express';
import { StateUseCase } from '../../../application/states/StateUseCase';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';

export class StateController extends ResponseData {
    constructor(private stateUseCase: StateUseCase) {
        super();
        this.getAllStates = this.getAllStates.bind(this);
        this.getOneState = this.getOneState.bind(this);
        this.createState = this.createState.bind(this);
        this.updateState = this.updateState.bind(this);
        this.deleteState = this.deleteState.bind(this);
    }

    public async getAllStates(req: Request, res: Response, next: NextFunction) {
        try {
            const states = await this.stateUseCase.getAllStates();
            this.invoke(states, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Error fetching states', 500));
        }
    }

    public async getOneState(req: Request, res: Response, next: NextFunction) {
        try {
            const state = await this.stateUseCase.getOneState(req.params.id);
            this.invoke(state, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Error fetching state', 500));
        }
    }

    public async createState(req: Request, res: Response, next: NextFunction) {
        try {
            const state = await this.stateUseCase.createState(req.body);
            this.invoke(state, 201, res, 'State created successfully', next);
        } catch (error) {
            next(new ErrorHandler('Error creating state', 500));
        }
    }

    public async updateState(req: Request, res: Response, next: NextFunction) {
        try {
            const state = await this.stateUseCase.updateState(req.params.id, req.body);
            this.invoke(state, 200, res, 'State updated successfully', next);
        } catch (error) {
            next(new ErrorHandler('Error updating state', 500));
        }
    }

    public async deleteState(req: Request, res: Response, next: NextFunction) {
        try {
            await this.stateUseCase.deleteState(req.params.id);
            this.invoke(null, 204, res, 'State deleted successfully', next);
        } catch (error) {
            next(new ErrorHandler('Error deleting state', 500));
        }
    }
}
