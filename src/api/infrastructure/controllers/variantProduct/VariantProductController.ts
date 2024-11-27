import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { VariantProductUseCase } from '../../../application/variantProduct/VariantProductUseCase';
import { IPhone} from '../../../domain/user/UserEntity';
import { body } from 'express-validator';



export class VariantProductController extends ResponseData {
    protected path = '/variant-product';    
    constructor(private readonly variantProductUseCase: VariantProductUseCase,
             
    ) {
        super();
        this.createVariant = this.createVariant.bind(this);

    }


    public async createVariant(req: Request, res: Response, next: NextFunction): Promise<IPhone | ErrorHandler | void> {
        const {body} = req.body
        try {
            const response = await this.variantProductUseCase.CreateVariant(body)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }







}