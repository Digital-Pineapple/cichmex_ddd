import { Router } from 'express';
import { BranchOfficeUseCase } from '../../../application/branchOffice/BranchOfficeUseCase';
import { DocumentationUseCase } from '../../../application/documentation/DocumentationUseCase';

import { BranchOfficeController } from '../../controllers/branchOffice/BranchOfficeController';
import { BranchOfficeRepository } from '../../repository/branch_office/BranchOfficeRepository';
import { DocumentationRepository } from '../../repository/documentation/DocumentationRepository';

import BranchOfficeModel from '../../models/BranchOffices/BranchOfficeModel';
import FileModel from '../../models/DocumentationModel';

import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import { BranchOfficeValidations } from '../../../../shared/infrastructure/validation/BranchOffice/BranchOfficeValidatios';
import { ProductOrderRepository } from '../../repository/product/ProductOrderRepository';
import ProductOrderModel from '../../models/products/ProductOrderModel';
import { ProductOrderUseCase } from '../../../application/product/productOrderUseCase';

const branchOfficeRouter = Router();

const branchOfficeRepository     = new BranchOfficeRepository(BranchOfficeModel);
const documentationRepository  = new DocumentationRepository(FileModel)
const productOrderRepository  = new ProductOrderRepository(ProductOrderModel)

const branchOfficeUseCase  = new BranchOfficeUseCase(branchOfficeRepository)
const documentationUseCase   = new DocumentationUseCase(documentationRepository)
const productOrderUseCase   = new ProductOrderUseCase(productOrderRepository)

const s3Service        = new S3Service()
const branchOfficeController     = new BranchOfficeController(branchOfficeUseCase, documentationUseCase,productOrderUseCase, s3Service);
const userValidations = new UserValidations();
const branchValidations = new BranchOfficeValidations()

branchOfficeRouter

.get('/',branchOfficeController.getAllBranchOffices)
.get('/info',branchOfficeController.getBranchOfficesInfo)
.get('/:id', branchOfficeController.getBranchOfficeDetail)
.get('/user/:id', branchOfficeController.getBranchesByUser)
.post('/',branchValidations.ImageValidation, userValidations.authTypeUserValidation(['SUPER-ADMIN','PARTNER']),  branchOfficeController.createBranchOffice)
.post('/verify/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN']),branchOfficeController.verifyBranchOffice)
.post('/desactivate/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN']),branchOfficeController.desactivateBranchOffice)
.patch('/:id', branchValidations.ImageValidation,userValidations.authTypeUserValidation(['SUPER-ADMIN','PARTNER']), branchOfficeController.updateBranchOffice)
.delete('/:id',userValidations.authTypeUserValidation(['SUPER-ADMIN','PARTNER']), branchOfficeController.deleteBranchOffice)

export default branchOfficeRouter;