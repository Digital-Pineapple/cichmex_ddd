import { Router } from 'express';

import { VariantProductRepository } from '../../repository/variantProduct/VariantProductRepository';
import { VariantProductUseCase } from '../../../application/variantProduct/VariantProductUseCase';
import { VariantProductController  } from '../../controllers/variantProduct/VariantProductController';
import {VariantProductModel} from '../../models/variantProduct/VariantProductModel';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';

const variantProductRouter = Router();

const variantProductRepository     = new VariantProductRepository(VariantProductModel);
const variantProductUseCase        = new VariantProductUseCase(variantProductRepository);
const variantProductController     = new VariantProductController(variantProductUseCase);
const userValidations = new UserValidations();

variantProductRouter
    .post('/',userValidations.authTypeUserValidation(['SUPER-ADMIN', 'ADMIN']), variantProductController.createVariant)
   

export default variantProductRouter;
