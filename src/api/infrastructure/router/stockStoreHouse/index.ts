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
import { ProductRepository } from '../../repository/product/ProductRepository';
import ProductModel from '../../models/products/ProductModel';
import { ProductUseCase } from '../../../application/product/productUseCase';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { ActivityLogger } from '../../../../shared/infrastructure/middleware/ActivityLogger';

const stockStoreHouseRouter = Router();

const stockSHinputRepository  = new StockSHinputRepository(StockSHinputModel);
const stockSHOutputRepository  = new StockSHOutputRepository(StockSHoutputModel);
const stockSHReturnRepository  = new StockSHReturnRepository(StockSHReturnModel)
const stockStoreHouseRepository    = new StockStoreHouseRepository(StockStoreHouseModel);
const productRepository  = new ProductRepository(ProductModel)

const stockSHinputUseCase    = new StockSHinputUseCase(stockSHinputRepository)
const stockSHoutputUseCase   = new StockSHoutputUseCase(stockSHOutputRepository);
const stockSHreturnUseCase   = new StockSHreturnUseCase(stockSHReturnRepository)
const stockStoreHouseUseCase      = new StockStoreHouseUseCase (stockStoreHouseRepository);
const productUseCase = new ProductUseCase( productRepository )
const s3Service = new S3Service()

const stockStoreHouseController   = new StockStoreHouseController(stockStoreHouseUseCase,stockSHinputUseCase,stockSHoutputUseCase,stockSHreturnUseCase, productUseCase, s3Service );

const userValidations = new UserValidations();

stockStoreHouseRouter

    .get('/', userValidations.authTypeUserValidation(['SUPER-ADMIN']), stockStoreHouseController.getAllStock)
    .get('/all-inputs',userValidations.authTypeUserValidation(['SUPER-ADMIN',"ADMIN"]), stockStoreHouseController.getAllInputs)
    .get('/all-outputs',userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), stockStoreHouseController.getAllOutputs)
    .get('/all-movements',userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), stockStoreHouseController.getAllMovements)
    .get('/online/:id', stockStoreHouseController.getAllStock)
    .get('/available/ok', stockStoreHouseController.getAvailableStock)
    .get('/available/products', stockStoreHouseController.getAvailableProducts)
    .get('/product/entries',userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), stockStoreHouseController.getProductsEntries)
    .get('/product/output',userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), stockStoreHouseController.getProductsOutputs)
    .get('/product/output',userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), stockStoreHouseController.seedProductStock)
    .get('/seed/StockProducts',userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]), stockStoreHouseController.seedProductStock )
    .get('/feed/daily', stockStoreHouseController.feedDailyProduct )
    .get('/inputs_pending',userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN", "WAREHOUSE-MANAGER", "WAREHOUSEMAN"]),   stockStoreHouseController.getAllInputsPending )
    .get('/inputs_pending_by_folio',userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN", "WAREHOUSE-MANAGER", "WAREHOUSEMAN"]),   stockStoreHouseController.getAllInputsPendingByFolio )
    .get('/inputs_by_folio/:folio',userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN", "WAREHOUSE-MANAGER", "WAREHOUSEMAN"]),   stockStoreHouseController.getInputsByFolio )
    .get('/inputs_report/:folio',userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN", "WAREHOUSE-MANAGER", "WAREHOUSEMAN"]),   stockStoreHouseController.PrintReportInputsByFolio )
    .get('/inputs/ready_to_accommodate', userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN", "WAREHOUSE-MANAGER", "WAREHOUSEMAN"]), stockStoreHouseController.readyToAccommodate )
    .post('/add/multiple-entries', userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN", ]),ActivityLogger, stockStoreHouseController.createMultipleStock )
    .post('/add/multiple-outputs', userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]),ActivityLogger, stockStoreHouseController.createMultipleOutputs )
    .post('/authorize/inputs', userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN", "WAREHOUSE-MANAGER", "WAREHOUSEMAN"]),ActivityLogger, stockStoreHouseController.authorizeInputs )
    .post('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]),ActivityLogger, stockStoreHouseController.createStock)
    .patch('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]),ActivityLogger, stockStoreHouseController.updateStock)
    .patch('/add/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]),ActivityLogger, stockStoreHouseController.addStock)
    .patch('/remove/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN', "ADMIN"]),ActivityLogger, stockStoreHouseController.removeStock)
    .patch('/return/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN','ADMIN']),ActivityLogger, stockStoreHouseController.returnStock)
    .delete('/', userValidations.authTypeUserValidation(['SUPER-ADMIN']),ActivityLogger, stockStoreHouseController.createStock)
    

export default stockStoreHouseRouter;

