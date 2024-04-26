import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { StockStoreHouseUseCase } from '../../../application/storehouse/stockStoreHouseUseCase'
import { StockSHinputUseCase } from '../../../application/storehouse/stockSHinputUseCase'
import { StockSHoutputUseCase } from '../../../application/storehouse/stockSHoutputUseCase'
import { StockSHreturnUseCase } from '../../../application/storehouse/stockSHreturnUseCase'


import { PopulateProductCS, stockBranchPopulateConfig  } from '../../../../shared/domain/PopulateInterfaces';


export class StockStoreHouseController extends ResponseData {
    protected path = '/stock-StoreHouse';

    constructor(
        private stockStoreHouseUseCase: StockStoreHouseUseCase,
        private stockSHinputUseCase: StockSHinputUseCase,
        private stockSHoutputUseCase : StockSHoutputUseCase,
        private stockSHreturnUseCase : StockSHreturnUseCase,
        ) {
        super();
        this.getAllStock = this.getAllStock.bind(this);
        this.createStock = this.createStock.bind(this);
        this.updateStock = this.updateStock.bind(this);
        this.addStock = this.addStock.bind(this);
        this.removeStock = this.removeStock.bind(this);
        this.returnStock = this.returnStock.bind(this);

    }

    public async getAllStock(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.stockStoreHouseUseCase.getStock()
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createStock(req: Request, res: Response, next: NextFunction) {
         const {  product_id,stock,   } = req.body;
         try{ 
            const available = await this.stockStoreHouseUseCase.getProductStock(product_id , PopulateProductCS)
            const available_id = available?._id 
            if (!available) {
                const response = await this.stockStoreHouseUseCase.createStock({product_id})
                const newQuantity = stock
                const entry = await this.stockSHinputUseCase.createInput({SHStock_id:response?._id,quantity:stock, newQuantity:newQuantity,})
                const allData = await this.stockStoreHouseUseCase.updateStock(available_id,{stock:entry.newQuantity})
               this.invoke(allData, 201, res, 'Se creó con éxito', next); 
            }else{
                next(new ErrorHandler(`Ya exite producto con id:${available_id} `, 500));
            }
        }
        catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al crear', 500));
        }

    }

    public async updateStock(req: Request, res: Response, next: NextFunction) {
        const { id }= req.params
        const { stock  } = req.body;
        
        try {
           const response = await this.stockStoreHouseUseCase.updateStock(id,{stock:stock})
                this.invoke(response, 201, res, 'Se actualizó con éxito', next);     
            
        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al actualizar', 500));
        }
    }

    public async addStock(req: Request, res: Response, next: NextFunction) {

        const { stock, product_id  } = req.body;
        
        try {
            const response = await this.stockStoreHouseUseCase.getProductStock(product_id, stockBranchPopulateConfig)
            const num1 = response.stock
            const num2 = parseInt(stock)
            const newQuantity = num1 + num2
           const update = await this.stockSHinputUseCase.createInput({ newQuantity: newQuantity, quantity:stock, SHStock_id: response._id })
           const allData = await this.stockStoreHouseUseCase.updateStock(response._id,{stock:update?.newQuantity})
                this.invoke(allData, 201, res, 'Se actualizó con éxito', next);     
            
        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al actualizar', 500));
        }
    }
    
    public async removeStock(req: Request, res: Response, next: NextFunction) {
        const { id }= req.params
        const { stock, product_id  } = req.body;
        const branch_id = id
        
        try {
            const response = await this.stockStoreHouseUseCase.getProductStock(product_id, stockBranchPopulateConfig)
            const num1 = response.stock
            const num2 = parseInt(stock)
            const newQuantity = num1 - num2
           const update = await this.stockSHoutputUseCase.createOutput({ newQuantity: newQuantity, quantity:stock, SHStock_id: response._id })
           const allData = await this.stockStoreHouseUseCase.updateStock(response._id,{stock:update?.newQuantity})
                this.invoke(allData, 201, res, 'Se actualizó con éxito', next);     
            
        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al actualizar', 500));
        }
    }

    public async returnStock(req: Request, res: Response, next: NextFunction) {
        const { stock, product_id, responsible_id  } = req.body;
        
        try {
            const response = await this.stockStoreHouseUseCase.getProductStock(product_id, stockBranchPopulateConfig)
            
            const num1 = response.stock
            const num2 = parseInt(stock)
            const newQuantity = num1 + num2
    
            
           const update = await this.stockSHreturnUseCase.createReturn({ newQuantity: newQuantity, quantity:stock, SHStock_id: response._id, responsible_id:responsible_id })
           const allData = await this.stockStoreHouseUseCase.updateStock(response._id,{stock:update?.newQuantity})
                this.invoke(allData, 201, res, 'Se actualizó con éxito', next);     
            
        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Hubo un error al actualizar', 500));
        }
    }

}