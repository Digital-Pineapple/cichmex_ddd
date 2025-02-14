import { Router } from 'express';

import { VariantProductRepository } from '../../repository/variantProduct/VariantProductRepository';
import { VariantProductUseCase } from '../../../application/variantProduct/VariantProductUseCase';
import { VariantProductController  } from '../../controllers/variantProduct/VariantProductController';
import {VariantProductModel} from '../../models/variantProduct/VariantProductModel';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import { ProductRepository } from '../../repository/product/ProductRepository';
import ProductModel from '../../models/products/ProductModel';
import { ProductUseCase } from '../../../application/product/productUseCase';
import { StockStoreHouseRepository } from '../../repository/stockStoreHouse/StockStoreHouseRepository';
import StockStoreHouseModel from '../../models/stockStoreHouse/StockStoreHouseModel';
import { StockStoreHouseUseCase } from '../../../application/storehouse/stockStoreHouseUseCase';
import { ProductValidations } from '../../../../shared/infrastructure/validation/Product/ProductValidation';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { StockSHinputRepository } from '../../repository/stockStoreHouse/StockSHinputRepository';
import StockSHinputModel from '../../models/stockStoreHouse/StockSHinputModel';
import { StockSHinputUseCase } from '../../../application/storehouse/stockSHinputUseCase';
import { ActivityLogger } from '../../../../shared/infrastructure/middleware/ActivityLogger';

const variantProductRouter = Router();

const variantProductRepository     = new VariantProductRepository(VariantProductModel);
const stockStoreHouseRepository = new StockStoreHouseRepository(StockStoreHouseModel)
const stockSHinputRepository  = new StockSHinputRepository(StockSHinputModel);
const stockSHinputUseCase    = new StockSHinputUseCase(stockSHinputRepository)
const productRepository = new ProductRepository(ProductModel)
const variantProductUseCase        = new VariantProductUseCase(variantProductRepository);
const productUseCase = new ProductUseCase(productRepository)
const productValidations = new ProductValidations()
const stockStoreHouseUseCase = new StockStoreHouseUseCase(stockStoreHouseRepository)
const s3Service = new S3Service();
const variantProductController     = new VariantProductController(variantProductUseCase, stockStoreHouseUseCase,stockSHinputUseCase, s3Service);
const userValidations = new UserValidations();

variantProductRouter
.post('/',userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']),ActivityLogger, variantProductController.createVariant)
.post ('/update/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']),ActivityLogger, variantProductController.updateVariant)
.post ('/addVariant/newSize',userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']),ActivityLogger, variantProductController.createVariantSize)
.post ('/update-is-main/ok/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']),ActivityLogger, variantProductController.updateIsMain)
.post ('/update/oneVariant/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']),ActivityLogger, variantProductController.updateIsMainOneVariant)
.post ('/updateImages',productValidations.productValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']),ActivityLogger, variantProductController.updateImages)
.post('/delete-image/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']),ActivityLogger, variantProductController.deleteImageVariant)
.delete('/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']),ActivityLogger, variantProductController.deleteVariant)
   

export default variantProductRouter;
