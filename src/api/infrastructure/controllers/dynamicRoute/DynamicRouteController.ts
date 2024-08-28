import { NextFunction, Request, Response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { DocumentationUseCase } from '../../../application/documentation/DocumentationUseCase';
import { IRespFile } from '../../../domain/documentation/DocumentationsEntity';
import { DynamicRouteUseCase } from '../../../application/dynamicRoutes/DynamicRouteUseCase';
import { generateUUID } from '../../../../shared/infrastructure/validation/Utils';


export class DynamicRouteController extends ResponseData {

    protected path = '/dynamicRoute';

    constructor(private dynamicRouteUseCase: DynamicRouteUseCase) {
        super();
        this.getAllRoutes = this.getAllRoutes.bind(this);
        this.getRoutes = this.getRoutes.bind(this);
        this.CreateRoute = this.CreateRoute.bind(this);
        this.UpdateRoute = this.UpdateRoute.bind(this);
        this.DeleteRoute = this.DeleteRoute.bind(this);
    }

    public async getAllRoutes(req: Request, res: Response, next: NextFunction) {
        try {
            const response: any = await this.dynamicRouteUseCase.getAllRoutes()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getRoutes(req: Request, res: Response, next: NextFunction) {
        const { type_user } = req.user
        const { system } = req.query
        console.log(req,'infodetail');
        
        console.log(system,type_user);
        

        try {
            const response: any = await this.dynamicRouteUseCase.getRoutes(type_user?.role,system)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async CreateRoute(req: Request, res: Response, next: NextFunction) {
        const { values } = req.body
        console.log(values);

        const uuid = generateUUID()
        try {
            const response: any = await this.dynamicRouteUseCase.createOneRoute({ ...values, uuid })
            this.invoke(response, 200, res, 'Ruta creada con éxito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al crear', 500));
        }
    }

    public async UpdateRoute(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const { values } = req.body
        
        try {
            const response: any = await this.dynamicRouteUseCase.updateOneRoute(id, { ...values })
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al editar', 500));
        }
    }
    public async DeleteRoute(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        try {
            const response: any = await this.dynamicRouteUseCase.deleteOneRoute(id)
            this.invoke(response, 200, res, 'Eliminado correctamente', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
}