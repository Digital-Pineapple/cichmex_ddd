import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { PaymentUseCase } from '../../../application/payment/paymentUseCase';
import { stringify } from 'uuid';

export class PaymentController extends ResponseData {
    protected path = '/payment'

    constructor(private paymentUseCase: PaymentUseCase) {
        super();
        this.getAllPayments = this.getAllPayments.bind(this);
        this.getPayment = this.getPayment.bind(this);
        this.createPayment = this.createPayment.bind(this);
        this.deletePayment = this.deletePayment.bind(this);
       
    }

    public async getAllPayments(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.paymentUseCase.getPayments();
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getPayment(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.paymentUseCase.getDetailPayment(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async createPayment(req: Request, res: Response, next: NextFunction) {
        const { values } = req.body;
       try{
            const response = await this.paymentUseCase.createNewPayment(values)
            this.invoke(response, 201, res, 'Registro exitoso', next);
        } catch (error) {
            next(new ErrorHandler('Error', 500));
        }
    }
    
    public async deletePayment(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.paymentUseCase.deleteOnePayment(id);
            this.invoke(response, 201, res, 'Eliminado con exito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error eliminar', 500));
        }
    }



}