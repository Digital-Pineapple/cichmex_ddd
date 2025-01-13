import { Request, Response, NextFunction, response } from 'express';

import { ResponseData } from "../../../../shared/infrastructure/validation/ResponseData";

import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { TaxInfoUseCase } from '../../../application/taxInfo/TaxInfoUseCase';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';

export class TaxInfoController extends ResponseData {
    protected path = '/type-car'

    constructor(
         private taxInfoUseCase: TaxInfoUseCase, 
         private readonly s3Service: S3Service,
        ) {
        super();
        this.getAllTaxInfo     = this.getAllTaxInfo.bind(this);
        this.getOneTaxInfo     = this.getOneTaxInfo.bind(this);
        this.createMyTaxInfo   = this.createMyTaxInfo.bind(this);
        this.updateMyTaxInfo   = this.updateMyTaxInfo.bind(this);
        this.updateOneTaxInfo  = this.updateOneTaxInfo.bind(this);
        this.deleteTaxInfo     = this.deleteTaxInfo.bind(this);
    }

    public async getAllTaxInfo(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.taxInfoUseCase.getAllTaxInfo();
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getOneTaxInfo(req: Request, res: Response, next: NextFunction) {
        const { id } = req.user;
        try {
           const response : any = await this.taxInfoUseCase.getMyTaxInfo(id)
        this.invoke(response,200,res,"", next)
          
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async createMyTaxInfo(req: Request, res: Response, next: NextFunction) {
        const { _id } = req.user;
        const { values } = req.body                
        try {
            const response = await this.taxInfoUseCase.createTaxInfo(_id, {...values, user:_id})
            this.invoke(response, 200, res, 'Se actualizó correctamente', next)
        } catch (error) {
            console.log(error);            
            next(new ErrorHandler('Hubo un error al crear ', 500));
        }
    }

    public async updateOneTaxInfo(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { values } = req.body
        try {
            const response = await this.taxInfoUseCase.updateTaxInfo(id, {...values})
            this.invoke(response, 200, res, 'Se actualizó correctamente', next)
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async updateMyTaxInfo(req: Request, res: Response, next: NextFunction) {
        const { id } = req.user;
        const { values } = req.body
        try {
            const myInfo : any = await this.taxInfoUseCase.getMyTaxInfo(id)
            const response = await this.taxInfoUseCase.updateTaxInfo(myInfo._id, {...values})
            this.invoke(response, 200, res, 'Se actualizó correctamente', next)
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }


    public async deleteTaxInfo(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.taxInfoUseCase.deleteTaxInfo(id);
            this.invoke(response, 200, res, 'Se eliminó correctamente', next)
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

}