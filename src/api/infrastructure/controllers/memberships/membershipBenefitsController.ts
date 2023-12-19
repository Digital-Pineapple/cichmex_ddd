import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { MembershipBenefitsUseCase } from '../../../application/membership/membershipBenefitsUseCase';

export class MembershipBenefitsController extends ResponseData {
    protected path = '/membership-benefits'

    constructor(private membershipBenefitsUseCase: MembershipBenefitsUseCase) {
        super();
        this.getAllMembershipsBenefits = this.getAllMembershipsBenefits.bind(this);
        this.getMembershipBenefit = this.getMembershipBenefit.bind(this);
        this.createMembershipBenefit = this.createMembershipBenefit.bind(this);
        this.updateMembershipBenefit = this.updateMembershipBenefit.bind(this);
        this.deleteMembershipBenefit = this.deleteMembershipBenefit.bind(this);
    
    }

    public async getAllMembershipsBenefits(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.membershipBenefitsUseCase.getMembershipBenefits()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getMembershipBenefit(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.membershipBenefitsUseCase.getDetailMembershipBenefit(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createMembershipBenefit(req: Request, res: Response, next: NextFunction) {
        const { membership_id,service_id,client_id,quantity,start_date, end_date,status } = req.body;
        
        try {
            const response = await this.membershipBenefitsUseCase.createNewMembershipBenefit(membership_id,service_id,client_id,quantity,start_date, end_date,status)
            this.invoke(response, 201, res, 'Alta con exito', next);
        } catch (error) {
            next(new ErrorHandler('Error al dar de alta', 500));
        }
    }

    public async updateMembershipBenefit(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { membership_id,service_id,client_id,quantity,start_date, end_date,status } = req.body;
        try {
                const response = await this.membershipBenefitsUseCase.updateOneMembershipBenefit(id,{membership_id,service_id,client_id,quantity,start_date, end_date,status})
                this.invoke(response, 201, res, 'Se actualizó con éxito', next);
           
        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al actualizar', 500));

        }
    }

    public async deleteMembershipBenefit(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.membershipBenefitsUseCase.deleteOneMembershipBenefit(id)
            this.invoke(response, 201, res, 'Eliminado con exito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error eliminar', 500));
        }
    }
}

