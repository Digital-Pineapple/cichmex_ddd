import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { StockBranchUseCase } from '../../../application/stockBranch/stockBranchUseCase'
import { StockInputhUseCase  } from '../../../application/stockBranch/stockInputUseCase'
import { StockOutputhUseCase } from '../../../application/stockBranch//stockOutputUseCase'
import { StockReturnUseCase  } from '../../../application/stockBranch/stockReturnUseCase'

import { stockBranchPopulateConfig  } from '../../../../shared/domain/PopulateInterfaces';
//';


export class StockBranchController extends ResponseData {
    protected path = '/stock_branch';

    constructor(
        private stockBranchUseCase: StockBranchUseCase,
        private stockInputUseCase: StockInputhUseCase,
        private stockOutputhUseCase : StockOutputhUseCase,
        private stockReturnUseCase : StockReturnUseCase,
        ) {
        super();
        this.getAllStockInBranch = this.getAllStockInBranch.bind(this);
        this.getOneStockBranchDetail = this.getOneStockBranchDetail.bind(this);
        this.createStockBranch = this.createStockBranch.bind(this);
        this.updateStockBranch = this.updateStockBranch.bind(this);
        this.addStocInkBranch = this.addStocInkBranch.bind(this);
        this.removeStocInkBranch = this.removeStocInkBranch.bind(this);
        this.returnStocInkBranch = this.returnStocInkBranch.bind(this);

    }

    public async getAllStockInBranch(req: Request, res: Response, next: NextFunction) {
        const {id} = req.params
        try {
            const response = await this.stockBranchUseCase.getStockInBranch(id);
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async getOneStockBranchDetail(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { product_id}= req.body
        const branch_id = id
        try {
          const response = await this.stockBranchUseCase.getOneStockInBranch(branch_id,product_id, stockBranchPopulateConfig)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
           
            
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async createStockBranch(req: Request, res: Response, next: NextFunction) {
         const { branch_id, product_id,stock  } = req.body;
         try{ 
            const available = await this.stockBranchUseCase.getOneStockInBranch(branch_id,product_id, stockBranchPopulateConfig)
            const available_id = available?._id 
            if (!available) {
                const response = await this.stockBranchUseCase.createStockBranch({branch_id, product_id})
                const newQuantity = stock
                const entry = await this.stockInputUseCase.createInput({stock_id:response?._id,quantity:stock, newQuantity:newQuantity,})
               
                const allData = await this.stockBranchUseCase.updateStockBranch(available_id,{stock:entry.newQuantity})
               this.invoke(allData, 201, res, 'Se creó con éxito', next); 
            }else{
                next(new ErrorHandler(`Ya exite producto con id:${available_id} `, 500));
            }
        }
        catch (error) {
          
            next(new ErrorHandler('Hubo un error al crear', 500));
        }

    }

    public async updateStockBranch(req: Request, res: Response, next: NextFunction) {
        const { id }= req.params
        const { stock  } = req.body;
        
        try {
           const response = await this.stockBranchUseCase.updateStockBranch(id,{stock:stock})
                this.invoke(response, 201, res, 'Se actualizó con éxito', next);     
            
        } catch (error) {
          
            next(new ErrorHandler('Hubo un error al actualizar', 500));
        }
    }
    public async addStocInkBranch(req: Request, res: Response, next: NextFunction) {
        const { id }= req.params
        const { stock, product_id  } = req.body;
        const branch_id = id
        
        try {
            const response = await this.stockBranchUseCase.getOneStockInBranch(branch_id,product_id, stockBranchPopulateConfig)
            const num1 = response.stock
            const num2 = parseInt(stock)
            const newQuantity = num1 + num2
           const update = await this.stockInputUseCase.createInput({ newQuantity: newQuantity, quantity:stock, stock_id: response._id })
           const allData = await this.stockBranchUseCase.updateStockBranch(response._id,{stock:update?.newQuantity})
                this.invoke(allData, 201, res, 'Se actualizó con éxito', next);     
            
        } catch (error) {
           
            next(new ErrorHandler('Hubo un error al actualizar', 500));
        }
    }
    
    public async removeStocInkBranch(req: Request, res: Response, next: NextFunction) {
        const { id }= req.params
        const { stock, product_id  } = req.body;
        const branch_id = id
        
        try {
            const response = await this.stockBranchUseCase.getOneStockInBranch(branch_id,product_id, stockBranchPopulateConfig)
            const num1 = response.stock
            const num2 = parseInt(stock)
            const newQuantity = num1 - num2
           const update = await this.stockOutputhUseCase.createOutStock({ newQuantity: newQuantity, quantity:stock, stock_id: response._id })
           const allData = await this.stockBranchUseCase.updateStockBranch(response._id,{stock:update?.newQuantity})
                this.invoke(allData, 201, res, 'Se actualizó con éxito', next);     
            
        } catch (error) {
            
            next(new ErrorHandler('Hubo un error al actualizar', 500));
        }
    }
    public async returnStocInkBranch(req: Request, res: Response, next: NextFunction) {
        const { id }= req.params
        const { stock, product_id, responsible_id  } = req.body;
        const branch_id = id
        
        try {
            const response = await this.stockBranchUseCase.getOneStockInBranch(branch_id,product_id, stockBranchPopulateConfig)
          
            
            const num1 = response.stock
            const num2 = parseInt(stock)
            const newQuantity = num1 + num2
    
            
           const update = await this.stockReturnUseCase.createReturn({ newQuantity: newQuantity, quantity:stock, stock_id: response._id, responsible_id:responsible_id })
           const allData = await this.stockBranchUseCase.updateStockBranch(response._id,{stock:update?.newQuantity})
                this.invoke(allData, 201, res, 'Se actualizó con éxito', next);     
            
        } catch (error) {
           
            next(new ErrorHandler('Hubo un error al actualizar', 500));
        }
    }

}