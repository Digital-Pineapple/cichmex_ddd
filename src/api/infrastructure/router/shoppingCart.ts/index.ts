import { Router } from 'express';
import { ShoppingCartRepository } from '../../repository/shoppingCart/ShoppingCartRepository'; 
import ShoppingCartModel from '../../models/ShoppingCartModel';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import { ShoppingCartUseCase } from '../../../application/shoppingCart.ts/ShoppingCartUseCase';
import { ShoppingCartController } from '../../controllers/shoppingCart/shoppingCartController';

const shoppingCartRouter = Router();

const shoppingCartRepository    = new ShoppingCartRepository(ShoppingCartModel);
const shoppingCartUseCase      = new ShoppingCartUseCase(shoppingCartRepository);

const shoppingCartController   = new ShoppingCartController(shoppingCartUseCase);

const userValidations = new UserValidations();

shoppingCartRouter
    .get('/', shoppingCartController.getAllShoppingCarts)
    .get('/:id', shoppingCartController.getShoppingCart)
    .post('/', shoppingCartController.createShoppingCart)
    .put('/:id',shoppingCartController.updateShoppingCart )
    .delete('/:id', shoppingCartController.deleteShoppingCart)
    

export default shoppingCartRouter;
