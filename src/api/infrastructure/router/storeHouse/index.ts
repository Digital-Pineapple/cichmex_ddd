import { Router } from 'express';
import { StoreHouseRepository } from '../../repository/storeHouse/StoreHouseRepository';

import { StoreHouseUseCase } from '../../../application/storehouse/storeHouseUseCase';

import {StoreHouseModel} from '../../models/storeHouse/StoreHouseModel';

import { StoreHouseController } from '../../controllers/storeHouse/StoreHouseController';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { StoreHouseValidations } from '../../../../shared/infrastructure/validation/StoreHouse/StoreHouseValidations';
import { ActivityLogger } from '../../../../shared/infrastructure/middleware/ActivityLogger';
import { StockStoreHouseRepository } from '../../repository/stockStoreHouse/StockStoreHouseRepository';
import StockStoreHouseModel from '../../models/stockStoreHouse/StockStoreHouseModel';
import { StockStoreHouseUseCase } from '../../../application/storehouse/stockStoreHouseUseCase';

const storeHouseRouter = Router();

const storeHouseRepository    = new StoreHouseRepository(StoreHouseModel);
const stockStoreHouseRepository = new StockStoreHouseRepository(StockStoreHouseModel) 


const storeHouseUseCase      = new StoreHouseUseCase (storeHouseRepository);
const stockStoreHouseUseCase = new StockStoreHouseUseCase(stockStoreHouseRepository)
const s3Service = new S3Service()

const storeHouseController   = new StoreHouseController(storeHouseUseCase,stockStoreHouseUseCase, s3Service );

const userValidations = new UserValidations();
const storeHouseValidations = new StoreHouseValidations()


storeHouseRouter

    .get('/', userValidations.authTypeUserValidation(['SUPER-ADMIN']),storeHouseController.getAllStoreHouses)
    .get('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN']),storeHouseController.getOneStoreHouse)
    .post('/', userValidations.authTypeUserValidation(['SUPER-ADMIN']),storeHouseValidations.imagesValidation, ActivityLogger, storeHouseController.createStoreHouse)
    .put('/update/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN']),storeHouseValidations.imagesValidation, ActivityLogger, storeHouseController.updateStoreHouse)
    .delete('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN']), ActivityLogger, storeHouseController.deleteStoreHouse)
    

export default storeHouseRouter;
