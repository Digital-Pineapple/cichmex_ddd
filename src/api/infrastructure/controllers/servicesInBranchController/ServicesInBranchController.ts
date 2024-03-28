import { NextFunction, Request, Response, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';

import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';

import { ServicesInBranchUseCase } from '../../../application/servicesInBranch/ServicesInBranchUseCase';


export class ServicesInBranchController extends ResponseData {


    constructor(private servicesInBranchUseCase: ServicesInBranchUseCase) {
        super();
        this.getAllServicesInBranch = this.getAllServicesInBranch.bind(this);
        this.getServiceInBranchDetail = this.getServiceInBranchDetail.bind(this);
        this.createServiceInBranch = this.createServiceInBranch.bind(this);
        this.updateServiceInBranch = this.updateServiceInBranch.bind(this);
        this.deleteServiceInBranch = this.deleteServiceInBranch.bind(this);
        this.getServicesInBranchByBranch = this.getServicesInBranchByBranch.bind(this);
    }

    public async getAllServicesInBranch(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.servicesInBranchUseCase.getServicesInBranch()
            this.invoke(response, 200, res, "", next);

        } catch (error) {
            next(new ErrorHandler('Error al consultar', 500));
        }
    }

    public async getServiceInBranchDetail(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.servicesInBranchUseCase.getDetailServiceInBranch(id)
            this.invoke(response, 200, res, '', next)
        } catch (error) {
            next(new ErrorHandler('Error', 404));
        }
    }
    public async getServicesInBranchByUser(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        try {
            const response = await this.servicesInBranchUseCase.getServicesInBranchByUser(id)
            this.invoke(response, 200, res, '', next)
        } catch (error) {
            console.log(error);

            next(new ErrorHandler('Error al encontrar el servicio', 404));
        }
    }
    public async getServicesInBranchByBranch(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        try {
            const response = await this.servicesInBranchUseCase.getServicesInBranchByBranch(id)
            this.invoke(response, 200, res, '', next)
        } catch (error) {
            console.log(error);

            next(new ErrorHandler('Error al encontrar el servicio', 404));
        }
    }

    public async createServiceInBranch(req: Request, res: Response, next: NextFunction) {
        const { user_id, service_id, typeCar_id, price, description, branch_id } = req.body;

        try {
            const response = await this.servicesInBranchUseCase
            .createServiceInBranch({  service_id, typeCar_id, price, description, branch_id })
            this.invoke(response, 201, res, 'Se creo con exito', next);
        } catch (error) {
            console.log(error);

            next(new ErrorHandler('Hubo un error al crear su servicio', 500))
        }
    }

    public async updateServiceInBranch(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const { user_id, service_id, typeCar_id, price, description, branch_id} = req.body

        try {

            const response = await this.servicesInBranchUseCase.updateServiceInBranch(id,{ service_id, typeCar_id, price, description, branch_id})
            this.invoke(response, 201, res, 'Actualizado con éxito', next);

        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Error al editar ', 500));

        }
    }

    public async deleteServiceInBranch(req: Request, res: Response, next: NextFunction) {

        const { id } = req.params;

        try {
            const response = await this.servicesInBranchUseCase.deleteServiceInBranch(id)
            this.invoke(response, 200, res, 'Eliminado correctamente', next);
        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al eliminar', 500));
        }

    }

}