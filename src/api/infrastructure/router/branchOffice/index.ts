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


const branchOfficeRouter = Router();

const branchOfficeRepository     = new BranchOfficeRepository(BranchOfficeModel);
const documentationRepository  = new DocumentationRepository(FileModel)

const branchOfficeUseCase  = new BranchOfficeUseCase(branchOfficeRepository)
const documentationUseCase   = new DocumentationUseCase(documentationRepository)

const s3Service        = new S3Service()
const branchOfficeController     = new BranchOfficeController(branchOfficeUseCase, documentationUseCase, s3Service);
const userValidations = new UserValidations();
const branchOfficeValidation = new BranchOfficeValidations()

branchOfficeRouter

.get('/',branchOfficeController.getAllBranchOffices)
.get('/:id', branchOfficeController.getBranchOfficeDetail)
.get('/user/:id', branchOfficeController.getBranchesByUser)
.post('/', branchOfficeController.createBranchOffice)
.post('/verify/:id' , branchOfficeController.verifyBranchOffice)
.put('/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53','65a8193ae6f31eef3013bc57']), branchOfficeController.updateBranchOffice)
.delete('/:id',userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53','65a8193ae6f31eef3013bc57']), branchOfficeController.deleteBranchOffice)

export default branchOfficeRouter;