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
import { ShippingCostRepository } from '../../repository/shippingCostRepository/ShippingCostRepository';
import ShippingCostModel from '../../models/ShippingCostModel';
import { ShippingCostUseCase } from '../../../application/shippingCost/ShippingCostUseCase';
import { ProductUseCase } from '../../../application/product/productUseCase';
import ProductModel from '../../models/products/ProductModel';
import { ProductRepository } from '../../repository/product/ProductRepository';

const shoppingCartRouter = Router();
const stockStoreHouseRepository = new StockStoreHouseRepository(StockStoreHouseModel);
const stockStoreHouseUseCase = new StockStoreHouseUseCase(stockStoreHouseRepository);
const productRepository = new ProductRepository(ProductModel);
const shoppingCartRepository    = new ShoppingCartRepository(ShoppingCartModel);
const shoppingCartUseCase      = new ShoppingCartUseCase(shoppingCartRepository);
const productUseCase = new ProductUseCase(productRepository);
const s3Service = new S3Service();
const shippingCostRepository = new ShippingCostRepository(ShippingCostModel);
const shippingCostUseCase = new ShippingCostUseCase(shippingCostRepository);
const shoppingCartController  = new ShoppingCartController(shoppingCartUseCase, stockStoreHouseUseCase, shippingCostUseCase, productUseCase, s3Service);

const userValidations = new UserValidations();

shoppingCartRouter
    .get('/all', shoppingCartController.getAllShoppingCarts)
    .get('/', userValidations.authTypeUserValidation(['CUSTOMER', 'ADMIN']), shoppingCartController.getShoppingCart)
    .post('/', userValidations.authTypeUserValidation(['CUSTOMER', 'ADMIN']), shoppingCartController.createShoppingCart)
    .put('/:id', userValidations.authTypeUserValidation(['CUSTOMER', 'ADMIN']), shoppingCartController.updateShoppingCart )
    .delete('/membership/:id', shoppingCartController.deleteMembershipInCart)
    .delete('/:id', userValidations.authTypeUserValidation(['CUSTOMER', 'ADMIN']), shoppingCartController.deleteShoppingCart)
    .delete('/product/:id', userValidations.authTypeUserValidation(['CUSTOMER']), shoppingCartController.deleteProductCart)
    .delete('/products/ok', userValidations.authTypeUserValidation(['CUSTOMER']), shoppingCartController.emptyCart)
    .put('/products/:id', userValidations.authTypeUserValidation(['CUSTOMER']), shoppingCartController.addToCart)
    .put('/product/quantity/:id', userValidations.authTypeUserValidation(['CUSTOMER']), shoppingCartController.updateProductQuantity)
    .put ('/merge/ok', userValidations.authTypeUserValidation(['CUSTOMER']), shoppingCartController.mergeCart) 
    .post('/no-auth', shoppingCartController.noAuthCart)


export default shoppingCartRouter;
