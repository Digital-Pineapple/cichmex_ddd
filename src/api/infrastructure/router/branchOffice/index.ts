import { Router } from 'express';
import { BranchOfficeUseCase } from '../../../application/branchOffice/BranchOfficeUseCase';
import { BranchOfficeController } from '../../controllers/branchOffice/BranchOfficeController';
import { BranchOfficeRepository } from '../../repository/branch_office/BranchOfficeRepository';
import BranchOfficeModel from '../../models/BranchOfficeModel';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';

const branchOfficeRouter = Router();

const branchOfficeRepository     = new BranchOfficeRepository(BranchOfficeModel);
const branchOfficeUseCase  = new BranchOfficeUseCase(branchOfficeRepository)
const s3Service        = new S3Service()
const branchOfficeController     = new BranchOfficeController(branchOfficeUseCase, s3Service);

branchOfficeRouter

.get('/',branchOfficeController.getAllBranchOffices)
.get('/:id', branchOfficeController.getBranchOfficeDetail)
.post('/', branchOfficeController.createBranchOffice)
.patch('/:id',  branchOfficeController.updateBranchOffice)
.delete('/:id',branchOfficeController.deleteBranchOffice)

export default branchOfficeRouter;