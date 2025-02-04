import { Router } from 'express';
import { TaxInfoRepository } from '../../repository/taxInfo/TaxInfoRepository';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import TaxInfoModel from '../../models/taxInfo/TaxInfoModel';
import { TaxInfoUseCase } from '../../../application/taxInfo/TaxInfoUseCase';
import { TaxInfoController } from '../../controllers/taxInfo/TaxInfoController';
import { FacturapiService } from '../../../../shared/infrastructure/facturapi/FacturapiService';

const taxInfoRouter = Router();

const taxInfoRepository     = new TaxInfoRepository(TaxInfoModel);
const taxInfoUseCase        = new TaxInfoUseCase(taxInfoRepository);
const s3Service             = new S3Service();
const facturapiService      = new FacturapiService();
const userValidations       = new UserValidations()
const taxInfoController     = new TaxInfoController(taxInfoUseCase, s3Service, facturapiService);

taxInfoRouter
.get('/', userValidations.authTypeUserValidation([ 'SUPER-ADMIN']), taxInfoController.getAllTaxInfo)
.get('/user', userValidations.authTypeUserValidation(['CUSTOMER' ]), taxInfoController.getOneTaxInfo)
.post('/addMyTaxInfo', userValidations.authTypeUserValidation([ 'CUSTOMER' ]), taxInfoController.createMyTaxInfo)
.post('/', userValidations.authTypeUserValidation([  'SUPER-ADMIN', 'ADMIN', 'CUSTOMER' ]), taxInfoController.updateMyTaxInfo)
.post('/:id', userValidations.authTypeUserValidation([  'SUPER-ADMIN', 'ADMIN' ]), taxInfoController.updateOneTaxInfo)
.delete('/:id', userValidations.authTypeUserValidation([  'SUPER-ADMIN', 'ADMIN', 'CUSTOMER' ]), taxInfoController.deleteTaxInfo)
.post("/create-invoice", userValidations.authTypeUserValidation([ 'SUPER-ADMIN', 'ADMIN', 'CUSTOMER' ]), taxInfoController.createInvoice)
    

export default taxInfoRouter;

