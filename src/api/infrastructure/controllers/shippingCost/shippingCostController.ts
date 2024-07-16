import { json, NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { ShippingCostUseCase } from '../../../application/shippingCost/ShippingCostUseCase';
import { generateUUID } from '../../../../shared/infrastructure/validation/Utils';


export class ShippingCostController extends ResponseData {

    protected path = '/ShippingCost';

    constructor(private shippingCostUseCase: ShippingCostUseCase) {
        super();
        this.getAllShippingCost = this.getAllShippingCost.bind(this);
        this.getOneShippingCost = this.getOneShippingCost.bind(this);
        this.getShippingCostByWeight = this.getShippingCostByWeight.bind(this);
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
            next(new ErrorHandler('Hubo un error al consultar la información', 404));
        }
    }

    public async getShippingCostByWeight(req: Request, res: Response, next: NextFunction) {
        const { weight } = req.query;
        try {
            const resp = await this.shippingCostUseCase.findShippingCost(weight)
            const price_weight = resp?.price_weight
            this.invoke({price_weight:price_weight}, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async creteShippingCost(req: Request, res: Response, next: NextFunction) {

        const { values } = req.body;
        const uuid = generateUUID()
        
        try{
            const response = await this.shippingCostUseCase.createShoppingCost({...values, uuid})
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
          const response = await this.shippingCostUseCase.updateShippingCost(id,values)
          this.invoke(response,200,res,'Se actualizó con éxito', next)
        } catch (error) {
            next(new ErrorHandler('Hubo un error al actualizar', 500));
        }
    }


    public async deleteShippingCost(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        try {
            const response = await this.shippingCostUseCase.deleteShippingCost(id)
            this.invoke(response, 200, res, 'Se eliminó con éxito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al eliminar', 500));
        }

    }

}