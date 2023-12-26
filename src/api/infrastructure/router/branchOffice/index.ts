import { Router } from 'express';
import { BranchOfficeUseCase } from '../../../application/branchOffice/BranchOfficeUseCase';
import { BranchOfficeController } from '../../controllers/branchOffice/BranchOfficeController';
import { BranchOfficeRepository } from '../../repository/branch_office/BranchOfficeRepository';
import BranchOfficeModel from '../../models/BranchOfficeModel';

const branchOfficeRouter = Router();

const branchOfficeRepository     = new BranchOfficeRepository(BranchOfficeModel);
const branchOfficeUseCase  = new BranchOfficeUseCase(branchOfficeRepository)
const branchOfficeController     = new BranchOfficeController(branchOfficeUseCase);

branchOfficeRouter

.get('/',branchOfficeController.getAllBranchOffices)
.get('/:id', branchOfficeController.getBranchOfficeDetail)
.post('/', branchOfficeController.createBranchOffice)
.patch('/:id', branchOfficeController.updateBranchOffice)
.delete('/:id',branchOfficeController.deleteBranchOffice)

export default branchOfficeRouter;