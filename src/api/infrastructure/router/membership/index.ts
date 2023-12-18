import { Router } from 'express';
import MembershipModel from '../../models/MembershipModel';
import { MembershipRepository } from '../../repository/membership/MembershipRepository';
import { MembershipUseCase } from '../../../application/membership/membershipUseCase';
import { MembershipsController } from '../../controllers/memberships/membershipController';

const membershipRouter = Router();

const membershipRepository    = new MembershipRepository(MembershipModel);
const membershipUseCase      = new MembershipUseCase (membershipRepository); 
const membershipController   = new MembershipsController(membershipUseCase);

membershipRouter
    .get('/', membershipController.getAllMemberships)
    .get('/:id',membershipController.getMembership)
    .post('/',membershipController.createMembership)
    .patch('/:id', membershipController.updateMembership)
    .delete('/:id', membershipController.deleteMembership)
    

export default membershipRouter;