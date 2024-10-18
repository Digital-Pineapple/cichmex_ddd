import { Router } from 'express';
import { ShoppingCartRepository } from '../../repository/shoppingCart/ShoppingCartRepository'; 
import ShoppingCartModel from '../../models/ShoppingCartModel';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import { ShoppingCartUseCase } from '../../../application/shoppingCart.ts/ShoppingCartUseCase';
import { ShoppingCartController } from '../../controllers/shoppingCart/shoppingCartController';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { StockStoreHouseRepository } from '../../repository/stockStoreHouse/StockStoreHouseRepository';
import StockStoreHouseModel from '../../models/stockStoreHouse/StockStoreHouseModel';
import { StockStoreHouseUseCase } from '../../../application/storehouse/stockStoreHouseUseCase';
import SizeGuideModel from '../../models/sizeGuide/SizeGuideModel';
import { SizeGuideRepository } from '../../repository/sizeGuide/SizeGuideRepository';
import { SizeGuideUseCase } from '../../../application/sizeGuide/SizeGuideUseCase';
import { SizeGuideController } from '../../controllers/sizeGuide/SizeGuideController';

const sizeGuideRouter = Router();

const sizeGuideRepository    = new SizeGuideRepository(SizeGuideModel);
const sizeGuideUseCase      = new SizeGuideUseCase(sizeGuideRepository);
const sizeGuideController   = new SizeGuideController(sizeGuideUseCase);
const userValidations = new UserValidations();

sizeGuideRouter
    .get('/', userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']), sizeGuideController.getMySizeGuides)
    .get('/:id',sizeGuideController.getOneGuide)
    .post('/addOne', userValidations.authTypeUserValidation(['SUPER-ADMIN,ADMIN']), sizeGuideController.createOneGuide)
    .put('/update/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN,ADMIN']), sizeGuideController.updateOneGuide)
    .delete('/id', userValidations.authTypeUserValidation(['SUPER-ADMIN,ADMIN']), sizeGuideController.deleteOneGuide)
    


export default sizeGuideRouter;
