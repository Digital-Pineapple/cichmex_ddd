import { Router } from 'express';
import { PaymentRepository } from '../../repository/payments/PaymentRespository';

import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import PaymentModel from '../../models/payments/PaymentModel';
import { PaymentUseCase } from '../../../application/payment/paymentUseCase';
import { PaymentController } from '../../controllers/paymentsController/paymentController';
import { MPService } from '../../../../shared/infrastructure/mercadopago/MPService';
import { PaymentValidations } from '../../../../shared/infrastructure/validation/Payment/PaymentValidation';

const paymentRouter = Router();

const paymentRepository = new PaymentRepository(PaymentModel);
const paymentUseCase = new PaymentUseCase(paymentRepository);
const mpService = new MPService()
const paymentController = new PaymentController(paymentUseCase, mpService);
const paymentValidation = new PaymentValidations();

paymentRouter
    .get('/', paymentController.getAllPayments)
    .get('/:id', paymentController.getPayment)
    .post('/',paymentValidation.paymentValidation, paymentController.createLMP)
    // .post('/ticket', paymentController)
    .delete('/:id', paymentController.deletePayment)


export default paymentRouter;