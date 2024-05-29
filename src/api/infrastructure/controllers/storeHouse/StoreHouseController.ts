import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';


import { PopulateProductCS, stockBranchPopulateConfig  } from '../../../../shared/domain/PopulateInterfaces';
import { StoreHouseUseCase } from '../../../application/storehouse/storeHouseUseCase';


export class StoreHouseController extends ResponseData {
    protected path = '/storeHouse';

    constructor(
        private storeHouseUseCase: StoreHouseUseCase,
        ) {
        super();
        this.getAllStoreHouses = this.getAllStoreHouses.bind(this);
        this.updateStoreHouse = this.updateStoreHouse.bind(this);
        this.createStoreHouse = this.createStoreHouse.bind(this);
        this.deleteStoreHouse = this.deleteStoreHouse.bind(this);
        this.getOneStoreHouse = this.getOneStoreHouse.bind(this);

    }

    public async getAllStoreHouses(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.storeHouseUseCase.getStoreHouses()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getOneStoreHouse(req: Request, res: Response, next: NextFunction) {
        const {id } = req.params
        
        try {
            const response = await this.storeHouseUseCase.getDetailStoreHouse(id)
            
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createStoreHouse(req: Request, res: Response, next: NextFunction) {
         const {  values  } = req.body;

         
         try{ 
            const response = await this.storeHouseUseCase.createStoreHouse(values)
            this.invoke(response, 200, res, '', next);
        }
        catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al crear', 500));
        }

    }
    public async updateStoreHouse(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const {  values  } = req.body;

        try{ 
           const response = await this.storeHouseUseCase.updateStoreHouse(id,values)
           this.invoke(response, 200, res, '', next);
       }
       catch (error) {
           next(new ErrorHandler('Hubo un error al editar', 500));
       }

   }

    public async deleteStoreHouse(req: Request, res: Response, next: NextFunction) {
        const {  id  } = req.params;
        try{ 
           const response = await this.storeHouseUseCase.updateStoreHouse(id,{status:false})
           this.invoke(response, 200, res, '', next);
       }
       catch (error) {
           console.log(error);
           next(new ErrorHandler('Hubo un error al eliminar', 500));
       }

   }

}