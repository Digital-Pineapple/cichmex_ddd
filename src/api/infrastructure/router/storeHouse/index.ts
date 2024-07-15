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

    .get('/', userValidations.authTypeUserValidation(['SUPER-ADMIN']),storeHouseController.getAllStoreHouses)
    .get('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN']),storeHouseController.getOneStoreHouse)
    .post('/', userValidations.authTypeUserValidation(['SUPER-ADMIN']), storeHouseController.createStoreHouse)
    .patch('/update/:id', storeHouseController.updateStoreHouse)
    .delete('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN']), storeHouseController.deleteStoreHouse)
    

export default storeHouseRouter;
