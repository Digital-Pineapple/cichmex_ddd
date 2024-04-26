import { Router } from 'express';
import { StoreHouseRepository } from '../../repository/storeHouse/StoreHouseRepository';

import { StoreHouseUseCase } from '../../../application/storehouse/storeHouseUseCase';

import {StoreHouseModel} from '../../models/storeHouse/StoreHouseModel';

import { StoreHouseController } from '../../controllers/storeHouse/StoreHouseController';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';

const storeHouseRouter = Router();

const storeHouseRepository    = new StoreHouseRepository(StoreHouseModel);


const storeHouseUseCase      = new StoreHouseUseCase (storeHouseRepository);

const storeHouseController   = new StoreHouseController(storeHouseUseCase );

const userValidations = new UserValidations();

storeHouseRouter

    .get('/', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc57']),storeHouseController.getAllStoreHouses)
    .post('/', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc57']), storeHouseController.createStoreHouse)


    

export default storeHouseRouter;
