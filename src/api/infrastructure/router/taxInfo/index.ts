import { Router } from 'express';
import { TaxInfoRepository } from '../../repository/taxInfo/TaxInfoRepository';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import TaxInfoModel from '../../models/taxInfo/TaxInfoModel';
import { TaxInfoUseCase } from '../../../application/taxInfo/TaxInfoUseCase';
import { TaxInfoController } from '../../controllers/taxInfo/TaxInfoController';
import { FacturapiService } from '../../../../shared/infrastructure/facturapi/FacturapiService';
import { ProductOrderRepository } from '../../repository/product/ProductOrderRepository';
import ProductOrderModel from '../../models/products/ProductOrderModel';
import { ProductOrderUseCase } from '../../../application/product/productOrderUseCase';

const taxInfoRouter = Router();
const productOrderRepository = new ProductOrderRepository(ProductOrderModel);
const productOrderUseCase   = new ProductOrderUseCase(productOrderRepository);
const taxInfoRepository     = new TaxInfoRepository(TaxInfoModel);
const facturapiService      = new FacturapiService();
const taxInfoUseCase        = new TaxInfoUseCase(taxInfoRepository, facturapiService);
const s3Service             = new S3Service();
const userValidations       = new UserValidations()
const taxInfoController     = new TaxInfoController(taxInfoUseCase, s3Service, facturapiService, productOrderUseCase);

taxInfoRouter
.get('/', userValidations.authTypeUserValidation([ 'SUPER-ADMIN']), taxInfoController.getAllTaxInfo)
.get('/user', userValidations.authTypeUserValidation(['CUSTOMER' ]), taxInfoController.getOneTaxInfo)
.post('/addMyTaxInfo', userValidations.authTypeUserValidation([ 'CUSTOMER' ]), taxInfoController.createMyTaxInfo)
.post('/', userValidations.authTypeUserValidation([  'SUPER-ADMIN', 'ADMIN', 'CUSTOMER' ]), taxInfoController.updateMyTaxInfo)
.post('/:id', userValidations.authTypeUserValidation([  'SUPER-ADMIN', 'ADMIN' ]), taxInfoController.updateOneTaxInfo)
.delete('/:id', userValidations.authTypeUserValidation([  'SUPER-ADMIN', 'ADMIN', 'CUSTOMER' ]), taxInfoController.deleteTaxInfo)
.post("/create-invoice", userValidations.authTypeUserValidation([ 'SUPER-ADMIN', 'ADMIN', 'CUSTOMER' ]), taxInfoController.createInvoice)
    

export default taxInfoRouter;

