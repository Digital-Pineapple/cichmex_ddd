import { Router } from 'express';
import MembershipModel from '../../models/Memberships/MembershipModel';
import { MembershipRepository } from '../../repository/membership/MembershipRepository';
import { MembershipUseCase } from '../../../application/membership/membershipUseCase';
import { MembershipsController } from '../../controllers/memberships/membershipController';
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';

const membershipRouter = Router();

const membershipRepository    = new MembershipRepository(MembershipModel);
const membershipUseCase      = new MembershipUseCase (membershipRepository); 
const membershipController   = new MembershipsController(membershipUseCase);
const userValidations = new UserValidations();

membershipRouter
    .get('/', membershipController.getAllMemberships)
    .get('/:id', userValidations.authTypeUserValidation(["SUPER-ADMIN", "PARTNER","CUSTOMER"]), membershipController.getMembership)
    .get('/info/:id', membershipController.getMembershipInfo)
    .post('/', userValidations.authTypeUserValidation(['SUPER-ADMIN']), membershipController.createMembership)
    .patch('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN']), membershipController.updateMembership)
    .delete('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN']), membershipController.deleteMembership)
    

export default membershipRouter;