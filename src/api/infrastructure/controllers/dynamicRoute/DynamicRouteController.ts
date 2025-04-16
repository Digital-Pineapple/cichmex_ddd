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
        this.getOneRoute = this.getOneRoute.bind(this);
        this.getPublicRoutes = this.getPublicRoutes.bind(this);
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
    public async getOneRoute(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params

        try {
            const response: any = await this.dynamicRouteUseCase.getOneRoute(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getRoutes(req: Request, res: Response, next: NextFunction) {
        const { type_user } = req.user;
        const { system } = req.query;
        
        try {
            const response: any = await this.dynamicRouteUseCase.getRoutes(type_user?.role, system);

            let responseData: any = [];
            if (!response || response.length === 0) {
                return next(new ErrorHandler('No se encontraron rutas', 404));
            }

            response.forEach((item: any) => {
                const { name, path, component, layout, authRequired, rolesAllowed } = item;
                responseData.push({ name, path, component, layout, authRequired, rolesAllowed });
            });

            return this.invoke(responseData, 200, res, '', next);

        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getPublicRoutes(req: Request, res: Response, next: NextFunction) {
        const { system } = req.query;

        try {
            const response: any = await this.dynamicRouteUseCase.getPublicRoutes(system)
            let responseData: any = [];

            if (!response || response.length === 0) {
                return next(new ErrorHandler('No se encontraron rutas', 404));
            }

            response.forEach((item: any) => {
                const { name, path, component, layout, authRequired, rolesAllowed } = item;
                responseData.push({ name, path, component, layout, authRequired, rolesAllowed });
            });

            return this.invoke(responseData, 200, res, '', next);

        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async CreateRoute(req: Request, res: Response, next: NextFunction) {
        const { values } = req.body
        const uuid = generateUUID()
        try {
            const response: any = await this.dynamicRouteUseCase.createOneRoute({ ...values, uuid })
            this.invoke(response, 200, res, 'Ruta creada con éxito', next);
        } catch (error) {
            console.log(error);
            
            next(new ErrorHandler('Hubo un error al crear', 500));
        }
    }

    public async UpdateRoute(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const { values } = req.body

        try {
            const response: any = await this.dynamicRouteUseCase.updateOneRoute(id, { ...values })            
            this.invoke(response, 200, res, 'Se edito correctamente', next);
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