import { Router } from 'express';
import { PaymentRepository } from '../../repository/payments/PaymentRespository';

import { UserValidations } from '../../../../shared/infrastructure/validation/User/UserValidation';
import PaymentModel from '../../models/payments/PaymentModel';
import { PaymentUseCase } from '../../../application/payment/paymentUseCase';
import { PaymentController } from '../../controllers/paymentsController/paymentController';

const paymentRouter = Router();

const paymentRepository = new PaymentRepository(PaymentModel);
const paymentUseCase = new PaymentUseCase(paymentRepository);
const paymentController = new PaymentController(paymentUseCase);
const userValidations = new UserValidations();

paymentRouter
    .get('/', paymentController.getAllPayments)
    .get('/:id', paymentController.getPayment)
    .post('/', paymentController.createPayment)
    .delete('/:id', paymentController.deletePayment)


export default paymentRouter;