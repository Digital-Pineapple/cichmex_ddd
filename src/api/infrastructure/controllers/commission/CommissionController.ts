import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { CommissionUseCase } from '../../../application/commission/CommissionUseCase';

export class CommissionController extends ResponseData {
    protected path = '/commission';

    constructor(private commissionUseCase: CommissionUseCase) {
        super();
        this.getAllCommissions = this.getAllCommissions.bind(this);
        this.getCommission     = this.getCommission.bind(this);
        this.createCommission  = this.createCommission.bind(this);
        this.updateCommission  = this.updateCommission.bind(this);
        this.deleteCommission  = this.deleteCommission.bind(this);

    }

    public async getAllCommissions(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.commissionUseCase.getCommissions();
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getCommission(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.commissionUseCase.getDetailCommission(id);
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createCommission(req: Request, res: Response, next: NextFunction) {
        const { name, amount, status, discount } = req.body;
        try {
            const response = await this.commissionUseCase.createNewCommission(name, amount, status, discount);
            this.invoke(response, 201, res, 'La comisión se creo con exito', next);
        } catch (error) {
         

            next(new ErrorHandler('Hubo un error al crear la comisión', 500));
        }
    }

    public async updateCommission(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name, amount, status, discount } = req.body;

        try {
            const response = await this.commissionUseCase.updateOneCommission(id, { name, amount, status, discount });
            this.invoke(response, 201, res, 'La comisión se actualizó con éxito', next);
        } catch (error) {
          
            next(new ErrorHandler('Hubo un error al actualizar la comisión', 500));
        }
    }

    public async deleteCommission(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.commissionUseCase.deleteOneCommission(id);
            this.invoke(response, 201, res, 'La comisión se elimino con exito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error eliminar la comisión', 500));
        }
    }
}

