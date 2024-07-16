import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { DocumentationUseCase } from '../../../application/documentation/DocumentationUseCase';
import { IRespFile } from '../../../domain/documentation/DocumentationsEntity';
import { ShippingCostUseCase } from '../../../application/shippingCost/ShippingCostUseCase';


export class ShippingCostController extends ResponseData {

    protected path = '/ShippingCost';

    constructor(private shippingCostUseCase: ShippingCostUseCase) {
        super();
        this.getAllShippingCost = this.getAllShippingCost.bind(this);
        this.getOneShippingCost = this.getOneShippingCost.bind(this);
        this.creteShippingCost  = this.creteShippingCost.bind(this);
        this.updateShippingCost = this.updateShippingCost.bind(this);
        this.deleteShippingCost = this.deleteShippingCost.bind(this);
    }

    public async getAllShippingCost(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.shippingCostUseCase.getShippingCosts()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getOneShippingCost(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const documentation = await this.shippingCostUseCase.getShippingCost(id)
            return this.invoke(documentation,200,res,'',next)
        } catch (error) {
            next(new ErrorHandler('Error al encontrar la documentacion', 404));
        }
    }

    public async creteShippingCost(req: Request, res: Response, next: NextFunction) {

        const { values } = req.body;

        try{
            const response = await this.shippingCostUseCase.createShoppingCost({...values})
            this.invoke(response,200,res,'Se creó con éxito', next)
        }
        catch (error) {
            next(new ErrorHandler('Hubo un error al crear ', 500));
        }



    }
    
    public async updateShippingCost(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { values } = req.body;

        try {
          const response = await this.shippingCostUseCase.updateShippingCostt(id,{...values})
          this.invoke(response,200,res,'Se actualizó con éxito', next)
        } catch (error) {
            next(new ErrorHandler('Hubo un error al actualizar la documentación', 500));
        }
    }


    public async deleteShippingCost(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        try {
            const response = await this.shippingCostUseCase.deleteShippingCost(id)
            this.invoke(response, 200, res, 'La documentación ha sido eliminado', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al eliminar la documentación', 500));
        }

    }

}