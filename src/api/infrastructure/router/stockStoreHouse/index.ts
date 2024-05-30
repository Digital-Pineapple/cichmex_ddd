import { Router } from 'express';
import { StockStoreHouseRepository } from '../../repository/stockStoreHouse/StockStoreHouseRepository';
import { StockSHinputRepository } from '../../repository/stockStoreHouse/StockSHinputRepository';
import { StockSHOutputRepository } from '../../repository/stockStoreHouse/StockSHOutputRepository';
import { StockSHReturnRepository } from '../../repository/stockStoreHouse/StockSHReturnRepository';

import { StockStoreHouseUseCase } from '../../../application/storehouse/stockStoreHouseUseCase';
import { StockSHinputUseCase } from '../../../application/storehouse/stockSHinputUseCase';
import { StockSHoutputUseCase } from '../../../application/storehouse/stockSHoutputUseCase';
import { StockSHreturnUseCase } from '../../../application/storehouse/stockSHreturnUseCase';

import StockStoreHouseModel from '../../models/stockStoreHouse/StockStoreHouseModel';
import StockSHinputModel from '../../models/stockStoreHouse/StockSHinputModel';
import StockSHoutputModel from '../../models/stockStoreHouse/StockSHoutputModel';
import StockSHReturnModel from '../../models/stockStoreHouse/StockSHReturnModel';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';

import { StockStoreHouseController } from '../../controllers/sotckStoreHouse/StockStoreHouseController';

const stockStoreHouseRouter = Router();
const stockSHinputRepository  = new StockSHinputRepository(StockSHinputModel);
const stockSHOutputRepository  = new StockSHOutputRepository(StockSHoutputModel);
const stockSHReturnRepository  = new StockSHReturnRepository(StockSHReturnModel)
const stockStoreHouseRepository    = new StockStoreHouseRepository(StockStoreHouseModel);

const stockSHinputUseCase    = new StockSHinputUseCase(stockSHinputRepository)
const stockSHoutputUseCase   = new StockSHoutputUseCase(stockSHOutputRepository);
const stockSHreturnUseCase   = new StockSHreturnUseCase(stockSHReturnRepository)
const stockStoreHouseUseCase      = new StockStoreHouseUseCase (stockStoreHouseRepository);

const stockStoreHouseController   = new StockStoreHouseController(stockStoreHouseUseCase,stockSHinputUseCase,stockSHoutputUseCase,stockSHreturnUseCase );

const userValidations = new UserValidations();

stockStoreHouseRouter

    .get('/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), stockStoreHouseController.getAllStock)
    .get('/online/:id', stockStoreHouseController.getAllStock)
    .get('/available/ok', stockStoreHouseController.getAvailableStock)
    .post('/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), stockStoreHouseController.createStock)
    .patch('/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), stockStoreHouseController.updateStock)
    .patch('/add/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), stockStoreHouseController.addStock)
    .patch('/remove/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), stockStoreHouseController.removeStock)
    .patch('/return/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), stockStoreHouseController.returnStock)
    .delete('/', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), stockStoreHouseController.createStock)
    

export default stockStoreHouseRouter;

