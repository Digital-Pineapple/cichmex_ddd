import { Router } from 'express';
import { CommissionRepository } from '../../repository/commission/commissionRepository';
import CommissionModel from '../../models/CommissionSchema';
import { CommissionUseCase } from '../../../application/commission/CommissionUseCase';
import { CommissionController } from '../../controllers/commission/CommissionController';


const commissionRouter = Router();

const commissionRepository    = new CommissionRepository (CommissionModel);
const commissionUseCase      = new CommissionUseCase (commissionRepository);
const commissionController   = new CommissionController(commissionUseCase);

commissionRouter

    .get('/', commissionController.getAllCommissions)
    .get('/:id', commissionController.getCommission)
    .post('/', commissionController.createCommission)
    .put('/:id', commissionController.updateCommission)
    .delete('/:id', commissionController.deleteCommission)
    

export default commissionRouter;

