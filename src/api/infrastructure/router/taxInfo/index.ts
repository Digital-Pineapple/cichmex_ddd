import { Router } from 'express';
import { TaxInfoRepository } from '../../repository/taxInfo/TaxInfoRepository';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import TaxInfoModel from '../../models/taxInfo/TaxInfoModel';
import { TaxInfoUseCase } from '../../../application/taxInfo/TaxInfoUseCase';
import { TaxInfoController } from '../../controllers/taxInfo/TaxInfoController';

const taxInfoRouter = Router();

const taxInfoRepository     = new TaxInfoRepository(TaxInfoModel);
const taxInfoUseCase        = new TaxInfoUseCase(taxInfoRepository);
const s3Service             = new S3Service();
const userValidations       = new UserValidations()
const taxInfoController     = new TaxInfoController(taxInfoUseCase,s3Service);

taxInfoRouter
.get('/', userValidations.authTypeUserValidation([ 'SUPER-ADMIN']), taxInfoController.getAllTaxInfo)
.get('/:id', userValidations.authTypeUserValidation(['CUSTOMER' ]), taxInfoController.getOneTaxInfo)
.post('/addMyTaxInfo', userValidations.authTypeUserValidation([ 'CUSTOMER' ]), taxInfoController.createMyTaxInfo)
.post('/', userValidations.authTypeUserValidation([  'SUPER-ADMIN', 'ADMIN', 'CUSTOMER' ]), taxInfoController.updateMyTaxInfo)
.post('/:id', userValidations.authTypeUserValidation([  'SUPER-ADMIN', 'ADMIN' ]), taxInfoController.updateOneTaxInfo)
.delete('/:id', userValidations.authTypeUserValidation([  'SUPER-ADMIN', 'ADMIN', 'CUSTOMER' ]), taxInfoController.deleteTaxInfo)
    

export default taxInfoRouter;

