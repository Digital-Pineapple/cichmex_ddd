import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { ActivityLogUseCase } from '../../../application/activityLog/ActivityLogUseCase';


export class ActivityLogController extends ResponseData {
    protected path = '/activityLog';

    constructor(private activityLogUseCase: ActivityLogUseCase) {
        super();
        this.getAllActivity = this.getAllActivity.bind(this);
    }

    public async getAllActivity(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.activityLogUseCase.getAllActivity()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
   



}