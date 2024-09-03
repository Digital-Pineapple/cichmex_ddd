import mongoose from 'mongoose';
import { ErrorHandler } from '../../../shared/domain/ErrorHandler';
import { DynamicRouteRepository } from '../../domain/dynamicRoute/DynamicRouteRepository'
import { DynamicRouteEntity } from '../../domain/dynamicRoute/DynamicRouteEntity';



export class DynamicRouteUseCase {

    constructor(private readonly dynamicRouteRepository: DynamicRouteRepository) { }

    public async getAllRoutes(): Promise<DynamicRouteEntity[] | null> {
        return await this.dynamicRouteRepository.findAll()
    }
    public async getOneRoute(id:string): Promise<DynamicRouteEntity[] | null> {
        return await this.dynamicRouteRepository.findById(id)
    }
    public async getRoutes(role: any, system:any): Promise<DynamicRouteEntity[] | null> {
        return await this.dynamicRouteRepository.findRoutes(role, system)
    }
    public async getPublicRoutes(system:any): Promise<DynamicRouteEntity[] | null> {
        return await this.dynamicRouteRepository.findPublicRoutes(system)
    }
    public async createOneRoute(body: any): Promise<DynamicRouteEntity | ErrorHandler | null> {
        const noRepeat = await this.dynamicRouteRepository.findOneItem({ name: body.name, status: true })    
        if (noRepeat) {
            return new ErrorHandler('Ruta existente', 500)
        }
        return await this.dynamicRouteRepository.createOne({ ...body })
    }
    public async updateOneRoute(id: any, updated: any): Promise<DynamicRouteEntity | null | ErrorHandler> {
        const route = await this.dynamicRouteRepository.findById(id)
        if (!route) {
            return new ErrorHandler('No existe ruta', 500)
        }
        return await this.dynamicRouteRepository.updateOne(id, { ...updated })
    }
    public async deleteOneRoute(id: any): Promise<DynamicRouteEntity | null | ErrorHandler> {
        const route = await this.dynamicRouteRepository.findById(id)
        if (!route) {
            return new ErrorHandler('No existe ruta', 500)
        }
        return await this.dynamicRouteRepository.updateOne(id, { status: false })
    }


}
