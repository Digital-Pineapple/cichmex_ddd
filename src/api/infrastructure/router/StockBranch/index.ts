import { Router } from 'express';
import { StockBranchRepository } from '../../repository/stockBranch/StockBranchRepository';
import { StockBranchUseCase } from '../../../application/stockBranch/stockBranchUseCase';
import { StockBranchController } from '../../controllers/stockBranch/StockBranchController';
import StockBranchModel from '../../models/StockBranchModel';

const stockBranchRouter = Router();

const stockBranchRepository    = new StockBranchRepository(StockBranchModel);
const stockBranchUseCase      = new StockBranchUseCase (stockBranchRepository);
const stockBranchController   = new StockBranchController(stockBranchUseCase);

stockBranchRouter

    .get('/:id', stockBranchController.getAllStockInBranch)
    .post('/', stockBranchController.createStockBranch)
    .get('/one/:id', stockBranchController.getOneStockBranchDetail)
    .patch('/:id', stockBranchController.updateStockBranch)
    

export default stockBranchRouter;

