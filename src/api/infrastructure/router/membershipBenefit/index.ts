import { Router } from 'express';
import MembershipBenefitsModel from '../../models/MembershipBenefitsModel';
import MembershipHistoryModel from '../../models/MembershipHistoryModel'
import { MembershipBenefitsRepository } from '../../repository/membership/MembershipBenefitRepository';
import { MembershipHistoryRepository } from '../../repository/membership/MembershipHistoryRepository';
import { MembershipBenefitsUseCase } from '../../../application/membership/membershipBenefitsUseCase';
import { MembershipHistoryUseCase } from '../../../application/membership/membershipHistoryUseCase';
import { MembershipBenefitsController } from '../../controllers/memberships/membershipBenefitsController'
import { AuthHeader } from '../../../../shared/infrastructure/middleware/AuthHeader';


const membershipBenefitRouter = Router();

const membershipBenefitsRespository = new MembershipBenefitsRepository(MembershipBenefitsModel)
const membershipHistoryRepository = new MembershipHistoryRepository(MembershipHistoryModel)
const membershipBenefitsUseCase = new MembershipBenefitsUseCase(membershipBenefitsRespository)
const membershipHistoryUseCase = new MembershipHistoryUseCase(membershipHistoryRepository)
const membershipBenefitsController = new MembershipBenefitsController(membershipBenefitsUseCase,membershipHistoryUseCase)



membershipBenefitRouter
    .get('/', membershipBenefitsController.getAllMembershipsBenefits)
    .get('/:id', membershipBenefitsController.getMembershipHistory)
    .post('/',membershipBenefitsController.createMembershipBenefit)
    // .patch('/:id', membershipBenefitsController.updateMembershipBenefit)
    .delete('/:id', membershipBenefitsController.deleteMembershipBenefit)
    .delete('/useUp/:id', membershipBenefitsController.getUpOneBenefit)
    

export default membershipBenefitRouter;