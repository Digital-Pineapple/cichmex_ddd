import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { MembershipUseCase } from '../../../application/membership/membershipUseCase';
import { stringify } from 'uuid';

export class MembershipsController extends ResponseData {
    protected path = '/membership'

    constructor(private membershipUseCase: MembershipUseCase) {
        super();
        this.getAllMemberships = this.getAllMemberships.bind(this);
        this.getMembership = this.getMembership.bind(this);
        this.getMembershipInfo = this.getMembershipInfo.bind(this);
        this.createMembership = this.createMembership.bind(this);
        this.updateMembership = this.updateMembership.bind(this);
        this.deleteMembership = this.deleteMembership.bind(this);
    
    }

    public async getAllMemberships(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.membershipUseCase.getMemberships();
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            console.log(error);
            
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getMembership(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.membershipUseCase.getDetailMembership(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getMembershipInfo(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        
        try {
            const response = await this.membershipUseCase.getInfoMembership(id)
            
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createMembership(req: Request, res: Response, next: NextFunction) {
        const { name, price_standard, discount_porcent, discount_products, service_quantity, type_cars } = req.body;
    
        try {
            let response;
            if (discount_porcent) {
                let discount = (price_standard * discount_porcent) / 100;
                const price_discount = price_standard - discount;
                response = await this.membershipUseCase.createNewMembership(name, price_standard, discount_porcent, discount_products, price_discount, service_quantity, type_cars);
            } else {
                response = await this.membershipUseCase.createNewMembership(name, price_standard, discount_products, service_quantity, type_cars);
            }
            this.invoke(response, 201, res, 'Alta con exito', next);
        } catch (error) {
            next(new ErrorHandler('Error al dar de alta', 500));
        }
    }
    

    public async updateMembership(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { name,price_standard, price_discount,service_quantity,status } = req.body;
        try {
                const response = await this.membershipUseCase.updateOneMembership(id, {name,price_standard, price_discount,service_quantity,status} )
                this.invoke(response, 201, res, 'Se actualizó con éxito', next);
           
        } catch (error) {
          
            next(new ErrorHandler('Hubo un error al actualizar', 500));

        }
    }

    public async deleteMembership(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.membershipUseCase.deleteOneMembership(id);
            this.invoke(response, 201, res, 'Eliminado con exito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error eliminar', 500));
        }
    }



}