import { Router } from 'express';
import { BranchOfficeUseCase } from '../../../application/branchOffice/BranchOfficeUseCase';
import { BranchOfficeController } from '../../controllers/branchOffice/BranchOfficeController';
import { BranchOfficeRepository } from '../../repository/branch_office/BranchOfficeRepository';
import BranchOfficeModel from '../../models/BranchOffices/BranchOfficeModel';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';

const branchOfficeRouter = Router();

const branchOfficeRepository     = new BranchOfficeRepository(BranchOfficeModel);
const branchOfficeUseCase  = new BranchOfficeUseCase(branchOfficeRepository)
const s3Service        = new S3Service()
const branchOfficeController     = new BranchOfficeController(branchOfficeUseCase, s3Service);
const userValidations = new UserValidations();

branchOfficeRouter

.get('/',branchOfficeController.getAllBranchOffices)
.get('/:id', branchOfficeController.getBranchOfficeDetail)
.get('/user/:id', branchOfficeController.getBranchesByUser)
.post('/', branchOfficeController.createBranchOffice)
.patch('/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53','65a8193ae6f31eef3013bc57']), branchOfficeController.updateBranchOffice)
.delete('/:id',userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), branchOfficeController.deleteBranchOffice)

export default branchOfficeRouter;