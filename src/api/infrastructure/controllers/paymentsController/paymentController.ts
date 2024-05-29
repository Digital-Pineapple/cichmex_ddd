import { Request, Response, NextFunction } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { PaymentUseCase } from '../../../application/payment/paymentUseCase';
import { MPService } from '../../../../shared/infrastructure/mercadopago/MPService';
import { MembershipBenefitsUseCase } from '../../../application/membership/membershipBenefitsUseCase';
import { MembershipUseCase } from '../../../application/membership/membershipUseCase';
import moment from 'moment';
import { MembershipHistoryUseCase } from '../../../application/membership/membershipHistoryUseCase';
import { ValidationRequestInstance } from 'twilio/lib/rest/api/v2010/account/validationRequest';
import { generateRandomCode } from '../../../../shared/infrastructure/validation/Utils';
import { v4 as uuidv4 } from 'uuid';
import { ProductOrderUseCase } from '../../../application/product/productOrderUseCase';

export class PaymentController extends ResponseData {
    protected path = '/payment'

    constructor(private paymentUseCase: PaymentUseCase,
        private readonly productOrderUseCase: ProductOrderUseCase,
        private readonly mpService: MPService,
        private readonly membershipBenefitUseCAse: MembershipBenefitsUseCase,
        private readonly membershipUseCase: MembershipUseCase,
        private readonly membershipHistoryUseCase: MembershipHistoryUseCase,

    ) {
        super();
        this.getAllPayments = this.getAllPayments.bind(this);
        this.getPayment = this.getPayment.bind(this);
        this.createLMP = this.createLMP.bind(this);
        this.createTicket = this.createTicket.bind(this);
        this.deletePayment = this.deletePayment.bind(this);
        this.createPaymentMP = this.createPaymentMP.bind(this)
        this.createPaymentProductMPLocation = this.createPaymentProductMPLocation.bind(this);
        this.PaymentSuccess = this.PaymentSuccess.bind(this)
        this.createPaymentProductMP = this.createPaymentProductMP.bind(this)


    }

    public async getAllPayments(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await this.paymentUseCase.getPayments();
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }
    public async getPayment(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.paymentUseCase.getDetailPayment(id)
            this.invoke(response, 200, res, '', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error al consultar la información', 500));
        }
    }

    public async createLMP(req: Request, res: Response, next: NextFunction) {
        const { values, user_id } = req.body;

        try {
            const { response, success, message } = await this.mpService.createLinkMP(values, user_id);

            if (success === true) {
                this.invoke(response?.init_point, 201, res, '', next);
            } else {
                next(new ErrorHandler(`Error: ${message}`, 500)); // Enviar error al siguiente middleware
            }
        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Error', 500)); // Enviar error al siguiente middleware
        }
    }


    public async createPaymentMP(req: Request, res: Response, next: NextFunction) {
        const { values, user, membership } = req.body;
        const uuid4 = uuidv4()
        try {
            const response1 = await this.paymentUseCase.createNewPayment({ uuid: uuid4 }) //crea un pago en base de datos
            const { response, success, message } = await this.mpService.createPaymentMP(values, user, { uuid: response1?.uuid }, membership); //respuesta de mercado libre
            const createPayment = await this.paymentUseCase.updateOnePayment(response1?._id, { MP_info: response, user_id: user.user_id }) // se actualiza la informacion en base de datos
            if (success === true && response?.status === 'approved') { // si la respuesta del pago es aprobada 
                if (!(createPayment instanceof ErrorHandler)) {
                    const client_id = createPayment.user_id;
                    const idMembership = response.additional_info?.items[0].id;
                    const membership_info = await this.membershipUseCase.getInfoMembership(idMembership);
                    if (!(membership_info instanceof ErrorHandler)) {
                        let start_date1 = moment().format('L');
                        let end_date1 = moment().add(30, 'days').calendar();
                        let services = membership_info?.service_quantity;
                        let mem_id = membership_info?.id
                        if (services !== undefined) {
                            await Promise.all(services.map(async (item) => {
                                try {
                                    const ok = await this.membershipBenefitUseCAse.createNewMembershipBenefit(
                                        mem_id,
                                        item.service_id._id,
                                        client_id,
                                        item.quantity,
                                        start_date1,
                                        end_date1
                                    );
                                    if (!(ok instanceof ErrorHandler)) {
                                        let m_id = ok?._id
                                        let quantity = parseInt(ok?.quantity)

                                        const historyPromises = Array.from({ length: quantity }, async () => {
                                            return this.membershipHistoryUseCase.createOneHistoryMembership(
                                                m_id
                                            );
                                        });
                                        await Promise.all(historyPromises);
                                    }
                                } catch (error) {
                                    console.log(error, 'error al crear beneficios');

                                }

                            }));
                        }
                    }


                    this.invoke(success, 200, res, 'Se pago correctamente', next)
                }

            } else {
                next(new ErrorHandler(`Error: ${message}`, 500)); // Si la respuesta de pago es negativa 
            }

        } catch (error) {
            console.log(error);
            next(new ErrorHandler('Error', 500)); //
        }


    }
    public async createPaymentProductMP(req: Request, res: Response, next: NextFunction) {
        const { products, user, branch_id, infoPayment, productsOrder } = req.body;
        
        const uuid4 = uuidv4()
        try {
            const response1 = await this.paymentUseCase.createNewPayment({ uuid: uuid4 }) //crea un pago en base de datos
            const { response, success, message } = await this.mpService.createPaymentProductsMP(products, user, { uuid: response1?.uuid }, infoPayment); //respuesta de mercado libre
            if (success === true && response?.status === 'approved') { // si la respuesta del pago es aprobada 
                try {
                    const createPayment = await this.paymentUseCase.updateOnePayment(response1?._id, { MP_info: response, user_id: user.user_id })
                    if (!(createPayment instanceof ErrorHandler)) {
                        const values1 = {
                            payment: createPayment?._id,
                            uuid: createPayment?.uuid,
                            products: productsOrder,
                            discount: infoPayment.discount,
                            subTotal: infoPayment.subtotal,
                            total: infoPayment.transaction_amount,
                            branch: branch_id,
                            user_id: user.user_id 
                        }
                        try {
                            const order = await this.productOrderUseCase.createProductOrder(values1)
                            this.invoke(order, 200, res, 'Ya puedes recoger tu producto en tienda', next)
                        } catch (error) {
                            next(new ErrorHandler('Error no se pudo crear su orden por favor contacte con servicio al cliente', 500)) //  
                        }
                    }


                } catch (error) {
                    next(new ErrorHandler(`Error:${error}`, 500))
                }

            } else {
                next(new ErrorHandler(`Error: ${message}`, 500)); // Si la respuesta de pago es negativa 
            }

        } catch (error) {
            next(new ErrorHandler('Error', 500)); //
        }


    }

    public async createPaymentProductMPLocation(req: Request, res: Response, next: NextFunction) {
        const { products, user, location, infoPayment, productsOrder } = req.body;
        
        const uuid4 = uuidv4()
        try {
            const response1 = await this.paymentUseCase.createNewPayment({ uuid: uuid4 }) //crea un pago en base de datos
            const { response, success, message } = await this.mpService.createPaymentProductsMP(products, user, { uuid: response1?.uuid }, infoPayment); //respuesta de mercado libre
            if (success === true && response?.status === 'approved') { // si la respuesta del pago es aprobada 
                try {
                    const createPayment = await this.paymentUseCase.updateOnePayment(response1?._id, { MP_info: response, user_id: user.user_id })
                    if (!(createPayment instanceof ErrorHandler)) {
                        const values1 = {
                            payment: createPayment?._id,
                            uuid: createPayment?.uuid,
                            products: productsOrder,
                            discount: infoPayment.discount,
                            subTotal: infoPayment.subtotal,
                            total: infoPayment.transaction_amount,
                            location: location,
                            user_id: user.user_id 
                        }
                        try {
                            const order = await this.productOrderUseCase.createProductOrder(values1)
                            this.invoke(order, 200, res, 'Ya puedes recoger tu producto en tienda', next)
                        } catch (error) {
                            next(new ErrorHandler('Error no se pudo crear su orden por favor contacte con servicio al cliente', 500)) //  
                        }
                    }


                } catch (error) {
                    next(new ErrorHandler(`Error:${error}`, 500))
                }

            } else {
                next(new ErrorHandler(`Error: ${message}`, 500)); // Si la respuesta de pago es negativa 
            }

        } catch (error) {
            next(new ErrorHandler('Error', 500)); //
        }


    }


    public async createTicket(req: Request, res: Response, next: NextFunction) {

        try {
            const info = await this.mpService.reciveWebHook(req);

            if (info !== undefined && info.status === 'approved') {

                const response = await this.paymentUseCase.createNewPayment({ MP_info: info });
                if (!(response instanceof ErrorHandler)) {
                    const id_client = response?.MP_info.additional_info.payer.first_name;
                    const idMembership = response?.MP_info.additional_info.items[0].id;
                    const membership_info = await this.membershipUseCase.getInfoMembership(idMembership);
                    if (!(membership_info instanceof ErrorHandler)) {
                        let start_date1 = moment().format('L');
                        let end_date1 = moment().add(30, 'days').calendar();
                        let services = membership_info?.service_quantity;
                        let mem_id = membership_info?.id
                        if (services !== undefined) {
                            await Promise.all(services.map(async (item) => {
                                try {
                                    const ok = await this.membershipBenefitUseCAse.createNewMembershipBenefit(
                                        mem_id,
                                        item.service_id._id,
                                        id_client,
                                        item.quantity,
                                        start_date1,
                                        end_date1
                                    );
                                    if (!(ok instanceof ErrorHandler)) {
                                        let m_id = ok?._id
                                        let quantity = parseInt(ok?.quantity)

                                        const historyPromises = Array.from({ length: quantity }, async () => {
                                            return this.membershipHistoryUseCase.createOneHistoryMembership(
                                                m_id
                                            );
                                        });
                                        await Promise.all(historyPromises);
                                    }
                                } catch (error) {
                                    console.log(error, 'error al crear beneficios');

                                }

                            }));
                        }
                    }
                }
            }
            res.status(200).send('OK');
            this.invoke(info, 201, res, 'Pago validado', next);
        } catch (error) {
            next(new ErrorHandler('Error', 500));
        }
    }

    public async PaymentSuccess(req: Request, res: Response, next: NextFunction) {

        try {
            const info = await this.mpService.reciveWebHook(req);
            res.status(200).send('OK');
            this.invoke(info, 201, res, 'Pago validado', next);
        } catch (error) {
            next(new ErrorHandler('Error', 500));
        }
    }



    public async deletePayment(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;
        try {
            const response = await this.paymentUseCase.deleteOnePayment(id);
            this.invoke(response, 201, res, 'Eliminado con exito', next);
        } catch (error) {
            next(new ErrorHandler('Hubo un error eliminar', 500));
        }
    }



}