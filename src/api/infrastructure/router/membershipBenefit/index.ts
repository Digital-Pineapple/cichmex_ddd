import { Router } from 'express';
import MembershipBenefitsModel from '../../models/Memberships/MembershipBenefitsModel';
import MembershipHistoryModel from '../../models/Memberships/MembershipHistoryModel'
import { MembershipBenefitsRepository } from '../../repository/membership/MembershipBenefitRepository';
import { MembershipHistoryRepository } from '../../repository/membership/MembershipHistoryRepository';
import { MembershipBenefitsUseCase } from '../../../application/membership/membershipBenefitsUseCase';
import { MembershipHistoryUseCase } from '../../../application/membership/membershipHistoryUseCase';
import { MembershipBenefitsController } from '../../controllers/memberships/membershipBenefitsController'
import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import validateAuthentication from '../../../../shared/infrastructure/validation/ValidateAuthentication';


const membershipBenefitRouter = Router();

const membershipBenefitsRespository = new MembershipBenefitsRepository(MembershipBenefitsModel)
const membershipHistoryRepository = new MembershipHistoryRepository(MembershipHistoryModel)
const membershipBenefitsUseCase = new MembershipBenefitsUseCase(membershipBenefitsRespository)
const membershipHistoryUseCase = new MembershipHistoryUseCase(membershipHistoryRepository)
const membershipBenefitsController = new MembershipBenefitsController(membershipBenefitsUseCase,membershipHistoryUseCase)
const userValidations = new UserValidations();



membershipBenefitRouter
    .get('/', userValidations.authTypeUserValidation(['SUPER-ADMIN']), membershipBenefitsController.getAllMembershipsBenefits)
    .get('/history', membershipBenefitsController.getHistory)
    .get('/:id',validateAuthentication, membershipBenefitsController.getMembershipHistory)
    .get('/user/:id', validateAuthentication, membershipBenefitsController.getAllMembershipsBenefitsByUser)
    .post('/Qr/Validate/:id', membershipBenefitsController.QrVerify)
    .post('/', userValidations.authTypeUserValidation(['SUPER-ADMIN']), membershipBenefitsController.createMembershipBenefit)
    .post('/sales-day', membershipBenefitsController.MembershipSales)
    // .patch('/:id', membershipBenefitsController.updateMembershipBenefit)
    .post('/consumeBenefit/:id', userValidations.authTypeUserValidation(['PARTNER']), membershipBenefitsController.consumeBenefit)
    .delete('/:id', userValidations.authTypeUserValidation(['SUPER-ADMIN']), membershipBenefitsController.deleteMembershipBenefit)
    .delete('/useUp/:id', userValidations.authTypeUserValidation(['CUSTOMER']), membershipBenefitsController.getUpOneBenefit)

    

export default membershipBenefitRouter;