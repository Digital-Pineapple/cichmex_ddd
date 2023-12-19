import { Router } from 'express';
import MembershipBenefitsModel from '../../models/MembershipBenefitsModel';
import { MembershipBEnefitsRepository } from '../../repository/membership/MembershipBenefitRepository';
import { MembershipBenefitsUseCase } from '../../../application/membership/membershipBenefitsUseCase';
import { MembershipBenefitsController } from '../../controllers/memberships/membershipBenefitsController';



const membershipBenefitRouter = Router();

const membershipBenefitsRepository    = new MembershipBEnefitsRepository(MembershipBenefitsModel);
const mebershipBenefitsUseCase      = new MembershipBenefitsUseCase (membershipBenefitsRepository); 
const membershipBenefitsController   = new MembershipBenefitsController(mebershipBenefitsUseCase);

membershipBenefitRouter
    .get('/', membershipBenefitsController.getAllMembershipsBenefits)
    .get('/:id',membershipBenefitsController.getMembershipBenefit)
    .post('/',membershipBenefitsController.createMembershipBenefit)
    .patch('/:id', membershipBenefitsController.updateMembershipBenefit)
    .delete('/:id', membershipBenefitsController.deleteMembershipBenefit)
    

export default membershipBenefitRouter;