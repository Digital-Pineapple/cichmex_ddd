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
    .get('/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), membershipController.getMembership)
    .post('/', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), membershipController.createMembership)
    .patch('/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), membershipController.updateMembership)
    .delete('/:id', userValidations.authTypeUserValidation(['65a8193ae6f31eef3013bc53']), membershipController.deleteMembership)
    

export default membershipRouter;