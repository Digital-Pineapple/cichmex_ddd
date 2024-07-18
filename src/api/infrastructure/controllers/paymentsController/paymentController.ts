import { Request, Response, NextFunction, response } from 'express';
import { ErrorHandler } from '../../../../shared/domain/ErrorHandler';
import { ResponseData } from '../../../../shared/infrastructure/validation/ResponseData';
import { PaymentUseCase } from '../../../application/payment/paymentUseCase';
import { MPService } from '../../../../shared/infrastructure/mercadopago/MPService';
import { MembershipBenefitsUseCase } from '../../../application/membership/membershipBenefitsUseCase';
import { MembershipUseCase } from '../../../application/membership/membershipUseCase';
import moment from 'moment';
import { MembershipHistoryUseCase } from '../../../application/membership/membershipHistoryUseCase';
import { v4 as uuidv4 } from 'uuid';
import { ProductOrderUseCase } from '../../../application/product/productOrderUseCase';
import MercadoPagoConfig, { Payment } from 'mercadopago';
import { config } from '../../../../../config';
import { generateUUID } from '../../../../shared/infrastructure/validation/Utils';


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
        // this.createPaymentProductMPLocation = this.createPaymentProductMPLocation.bind(this);
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

            next(new ErrorHandler('Error', 500)); // Enviar error al siguiente middleware
        }
    }


    public async createPaymentMP(req: Request, res: Response, next: NextFunction) {
        const { membership, user, values } = req.body;
    

        const access_token = config.MERCADOPAGO_TOKEN;
        const client = new MercadoPagoConfig({ accessToken: access_token, options: { timeout: 5000 } });
        const payment1 = new Payment(client);
        const uuid4 = uuidv4();

        try {
            // Crea un pago en la base de datos
            const response1 = await this.paymentUseCase.createNewPayment({ uuid: uuid4 });

            const path_notification = `${process.env.URL_NOTIFICATION}api/payments/Mem-Payment-success`;

            const body1: any = {
                transaction_amount: values.transaction_amount,
                payment_method_id: values.payment_method_id,
                payer: {
                    email: values.payer.email,
                },
                additional_info: {
                    items: [
                        {
                            id: membership._id,
                            title: membership.name,
                            description: membership.service_quantity[0].service_id.description,
                            quantity: 1,
                            unit_price: membership.price_discount,
                        }
                    ],
                    payer: {
                        first_name: user.user_id,

                    },
                },
                token: values.token,
                issuer_id: values.issuer_id,
                installments: values.installments,
                notification_url: path_notification,
                external_reference: response1?._id,


            };

            try {
                const payment = await payment1.create({
                    requestOptions: { idempotencyKey: response1.uuid, },
                    body: body1
                });
                if (payment?.status === 'approved') {
                    try {
                        const { user_id } = await this.paymentUseCase.updateOnePayment(response1?._id, {
                            MP_info: payment,
                            user_id: user._id,
                            payment_status: payment?.status

                        });
                        const client_id = user_id;
                        const idMembership = membership._id
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
                                        next(new ErrorHandler(`Error: ${error}`, 500));
                                    }

                                }));
                            }
                        }
                        this.invoke(response, 200, res, 'Se pago correctamente', next)



                    } catch (error) {
                        next(new ErrorHandler(`Error al actualizar el pago: ${error}`, 500));
                    }
                } else {
                    next(new ErrorHandler('No se aprobó el pago', 500));
                }

            } catch (error) {

                next(new ErrorHandler('Error al crear el pago con MercadoPago', 500));
            }
        } catch (error) {
            console.log(error);


            next(new ErrorHandler('Error al crear el pago en la base de datos', 500));
        }

    }

    public async createPaymentProductMP(req: Request, res: Response, next: NextFunction) {
        const { products, user, branch_id, infoPayment, productsOrder, location, typeDelivery } = req.body;
        const access_token = config.MERCADOPAGO_TOKEN;
        const client = new MercadoPagoConfig({ accessToken: access_token, options: { timeout: 5000 } });
        const payment1 = new Payment(client);
        const uuid4 = generateUUID() 


        try {
            // Crea un pago en la base de datos
            const response1 = await this.paymentUseCase.createNewPayment({ uuid: uuid4 });

            const { formData, selectedPaymentMethod } = infoPayment;
            const metadata1 = formData?.metadata


            const point = metadata1?.payment_point ? metadata1.payment_point : null



            const path_notification = `${process.env.URL_NOTIFICATION}api/payments/Mem-Payment-success`;

            const body1: any = {
                transaction_amount: formData.transaction_amount,
                payment_method_id: formData.payment_method_id,
                payer: {
                    email: formData.payer.email,
                    first_name: formData.payer.first_name,
                    last_name: formData.payer.last_name,
                    // id:user.user_id,


                },
                additional_info: {
                    items: products,
                    payer: {
                        first_name: user.user_id,

                    },
                },
                token: formData.token,
                issuer_id: formData.issuer,
                installments: formData.installments,
                notification_url: path_notification,
                external_reference: response1?._id,
                statement_descriptor: formData.statement_descriptor,


            };



            if (selectedPaymentMethod === "ticket") {
                body1['metadata'] = { payment_point: point };

            }


            try {
                const payment = await payment1.create({
                    requestOptions: { idempotencyKey: response1.uuid, },
                    body: body1
                });


                if (payment) {
                    try {
                        const createPayment = await this.paymentUseCase.updateOnePayment(response1?._id, {
                            MP_info: payment,
                            user_id: user.user_id,
                            payment_status: payment?.status
                        });

                        if (!(createPayment instanceof ErrorHandler)) {
                            const values1: any = {
                                payment: createPayment?._id,
                                uuid: createPayment?.uuid,
                                products: productsOrder,
                                discount: infoPayment.discount,
                                subTotal: infoPayment.subtotal,
                                total: infoPayment.formData.transaction_amount,
                                user_id: user.user_id,
                                paymentType: infoPayment.paymentType,
                                payment_status: payment?.status,
                                download_ticket: payment?.transaction_details?.external_resource_url,

                            };
                            if (typeDelivery === 'homedelivery') {
                                values1['deliveryLocation'] = location;

                            }
                            if (typeDelivery === 'pickup') {
                                values1['branch'] = branch_id
                                values1['point_pickup_status'] = false
                            }

                            try {
                                const order = await this.productOrderUseCase.createProductOrder(values1);
                                const responseOrder = { ...order, id: payment?.id };
                                this.invoke(responseOrder, 200, res, '', next);
                            } catch (error) {
                                next(new ErrorHandler('Error: No se pudo crear su orden. Por favor, contacte con servicio al cliente', 500));
                            }
                        }
                    } catch (error) {
                        next(new ErrorHandler(`Error al actualizar el pago: ${error}`, 500));
                    }
                } else {
                    next(new ErrorHandler('Error en la respuesta de pago', 500));
                }
            } catch (error) {

                next(new ErrorHandler('Error al crear el pago con MercadoPago', 500));
            }
        } catch (error) {
            console.log(error);


            next(new ErrorHandler('Error al crear el pago en la base de datos', 500));
        }
    }




    public async createTicket(req: Request, res: Response, next: NextFunction) {

        try {
            const info = await this.mpService.reciveWebHook(req);

            if (info !== undefined && info.status === 'approved') {

                const response = await this.paymentUseCase.createNewPayment({ MP_info: info });
                if (!(response instanceof ErrorHandler)) {
                    const id_client = response.MP_info?.additional_info.payer.first_name;
                    const idMembership = response.MP_info?.additional_info.items[0].id;
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
                                    next(new ErrorHandler(`Error${error}`, 500));

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