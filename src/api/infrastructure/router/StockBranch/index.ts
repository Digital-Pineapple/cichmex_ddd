import { Router } from 'express';
import { StockBranchRepository } from '../../repository/stockBranch/StockBranchRepository';
import { StockInputRepository } from '../../repository/stockBranch/StockInputRepository';
import { StockOutputRepository } from '../../repository/stockBranch/StockOutputRepository';
import { StockReturnRepository } from '../../repository/stockBranch/StockReturnRepository';

import { StockBranchUseCase } from '../../../application/stockBranch/stockBranchUseCase';
import { StockInputhUseCase } from '../../../application/stockBranch/stockInputUseCase';
import { StockOutputhUseCase } from '../../../application/stockBranch/stockOutputUseCase';
import { StockReturnUseCase } from '../../../application/stockBranch/stockReturnUseCase';


import { StockBranchController } from '../../controllers/stockBranch/StockBranchController';
import StockBranchModel from '../../models/stock/StockBranchModel';
import StockInputModel from '../../models/stock/StockInputModel';
import StockOutputModel from '../../models/stock/StockOutputModel';
import StockReturnModel from '../../models/stock/StockReturnModel';


const stockBranchRouter = Router();
const stockInputRepository  = new StockInputRepository(StockInputModel);
const stockOutputRepository  = new StockOutputRepository(StockOutputModel);
const stockReturnRepository  = new StockReturnRepository(StockReturnModel)

const stockBranchRepository    = new StockBranchRepository(StockBranchModel);
const stockInputUseCase    = new StockInputhUseCase(stockInputRepository)
const stockOutputhUseCase   = new StockOutputhUseCase(stockOutputRepository);
const stockReturnUseCase   = new StockReturnUseCase(stockReturnRepository)
const stockBranchUseCase      = new StockBranchUseCase (stockBranchRepository);

const stockBranchController   = new StockBranchController(stockBranchUseCase,stockInputUseCase,stockOutputhUseCase,stockReturnUseCase );

stockBranchRouter

    .get('/:id', stockBranchController.getAllStockInBranch)
    .post('/', stockBranchController.createStockBranch)
    .get('/one/:id', stockBranchController.getOneStockBranchDetail)
    .patch('/:id', stockBranchController.updateStockBranch)
    .patch('/add/:id', stockBranchController.addStocInkBranch)
    .patch('/remove/:id', stockBranchController.removeStocInkBranch)
    .patch('/return/:id', stockBranchController.returnStocInkBranch)

    

export default stockBranchRouter;

