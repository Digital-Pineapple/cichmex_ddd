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
import { generateUUID, RandomCodeId } from '../../../../shared/infrastructure/validation/Utils';
import { StockSHoutputUseCase } from '../../../application/storehouse/stockSHoutputUseCase';
import { StockStoreHouseUseCase } from '../../../application/storehouse/stockStoreHouseUseCase';
import { S3Service } from '../../../../shared/infrastructure/aws/S3Service';
import { MomentService } from '../../../../shared/infrastructure/moment/MomentService';
import { PaymentEntity, PaymentVoucher } from '../../../domain/payments/PaymentEntity';
import { ShoppingCartUseCase } from '../../../application/shoppingCart.ts/ShoppingCartUseCase';
import mongoose from 'mongoose';
import { getProperties, parseProductsToMercadoPago } from '../../../../helpers/products';
import { NotificationUseCase } from '../../../application/Notifications/NotificationUseCase';


export class PaymentController extends ResponseData {
    protected path = '/payment'

    constructor(private paymentUseCase: PaymentUseCase,
        private readonly productOrderUseCase: ProductOrderUseCase,
        private readonly mpService: MPService,
        private readonly membershipBenefitUseCAse: MembershipBenefitsUseCase,
        private readonly membershipUseCase: MembershipUseCase,
        private readonly membershipHistoryUseCase: MembershipHistoryUseCase,
        private readonly stockStoreHouseUseCase: StockStoreHouseUseCase,
        private readonly stockSHoutputUseCase: StockSHoutputUseCase,
        private readonly shoppingCartUseCase: ShoppingCartUseCase,
        private readonly s3Service: S3Service, 
        private readonly notificationUseCase: NotificationUseCase       


    ) {
        super();
        this.getAllPayments = this.getAllPayments.bind(this);
        this.getPayment = this.getPayment.bind(this);
        this.createLMP = this.createLMP.bind(this);
        this.createTicket = this.createTicket.bind(this);
        this.deletePayment = this.deletePayment.bind(this);
        this.createPaymentMP = this.createPaymentMP.bind(this)
        this.transferPayment = this.transferPayment.bind(this)
        // this.createPaymentProductMPLocation = this.createPaymentProductMPLocation.bind(this);
        this.PaymentSuccess = this.PaymentSuccess.bind(this)
        this.createPaymentProductMP = this.createPaymentProductMP.bind(this)
        this.addTicket = this.addTicket.bind(this);
         this.autoCancelPO = this.autoCancelPO.bind(this);
        this.validateProofOfPayment = this.validateProofOfPayment.bind(this)
        this.deleteVoucher = this.deleteVoucher.bind(this)
        this.editVoucher = this.editVoucher.bind(this)
        this.rejectProofOfPayment = this.rejectProofOfPayment.bind(this);
        // this.createOrder = this.createOrder.bind(this);
        this.webhook = this.webhook.bind(this);
        this.webhookMP = this.webhookMP.bind(this)

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

    public async autoCancelPO(req: Request, res: Response, next: NextFunction) {
        try {
            const access_token = config.MERCADOPAGO_TOKEN;
            const client = new MercadoPagoConfig({ accessToken: access_token, options: { timeout: 5000 } });
            const payment1 = new Payment(client);
    
            // Obtener pagos expirados
            const [PaymentMP , PaymentsTransfer ] = await Promise.all([
                this.paymentUseCase.getPaymentsMPExpired(),
                this.paymentUseCase.getPaymentsTransferExpired(),
            ]);
    
            // Función para actualizar pagos y órdenes
            const cancelPaymentAndOrder = async (payment: any, statusReason: string) => {
                
                await this.paymentUseCase.updateOnePayment(payment._id, {
                    status: false,
                    payment_status: 'cancelled',
    
                });
                
                const PO = await this.productOrderUseCase.getOnePO({ order_id: payment.order_id });
               
                await this.productOrderUseCase.updateProductOrder(PO._id, {
                    status: false,
                    payment_status: 'cancelled',
                });
            };
            
    
   //         Procesar pagos de MercadoPago
            const paymentMPPromises : any = PaymentMP?.map(async (payment: any) => {
                
                try {
                    // Intentar obtener información de MercadoPago
                    const infoPayment = await payment1.get({ id: payment.MP_info.id.toString() });
                    await this.updatePaymentAndOrder(payment, infoPayment);
                } catch (err: any) {
                    console.log(err);
                    
                    if (err.status === 404) {
                        // Si el pago no existe, cancelar pago y orden
                        await cancelPaymentAndOrder(payment, 'Payment not found in MercadoPago');
                    } else {
                        console.error(`Error al obtener información de pago con id ${payment.MP_info.id}:`, err);
                    }
                }
            });

          //  Procesar pagos por transferencia
            const paymentTransferPromises = PaymentsTransfer.map(async (payment: any) => {
                
                try {
                    // Cancelar pago y orden directamente
                    await cancelPaymentAndOrder(payment, 'Expired transfer payment');
                } catch (err: any) {
                    console.error(`Error al procesar el pago por transferencia con id ${payment._id}:`, err);
                }
            });
    
            // Esperar a que todas las operaciones se completen
            await Promise.all([...paymentMPPromises, ...paymentTransferPromises]);
    
            // Respuesta final
            this.invoke('', 200, res, 'Verificación completa', next);
        } catch (error: any) {
            console.log(error);
            
            next(new ErrorHandler(`Hubo un error al consultar la información: ${error.message}`, 500));
        }
    }
    
    
    private async updatePaymentAndOrder(payment: any, infoPayment: any) {
        const status = infoPayment.status;
        const payment_id = payment._id.toString()
        console.log(status);
        
        // Actualizar el estado del pago en tu base de datos
        await this.paymentUseCase.updateOnePayment(payment_id, { payment_status: status });
    
        // Obtener la orden de producto asociada
        const PO = await this.productOrderUseCase.getOnePO({ order_id: payment.order_id});
        
        if (PO) {
            if (status === "approved" || status === "in_process") {
                // Actualizar la orden de producto si el pago fue aprobado o está en proceso
                await this.productOrderUseCase.updateProductOrder(PO._id, { payment_status: status });
            } else {
                // Marcar como inactivo si el estado es diferente (rechazado, cancelado, etc.)
                await this.productOrderUseCase.updateProductOrder(PO._id, { payment_status: status, status: false });
            }
        } else {
            
            console.error(`No se encontró una orden de producto con order_id ${payment.order_id}`);
        }
    }

    public async createLMP(req: Request, res: Response, next: NextFunction) {                
        const origin = req.headers["x-origin"] || "web";            
        try {                     
            await this.stockStoreHouseUseCase.validateProductsStock(req.body.cart);
            const { response, success, message } = await this.mpService.createLinkMP(req.body, origin);
            // if(success){
            this.invoke({ init_point: response?.init_point, id: response?.id }, 201, res, '', next);
            // } else {
            //     next(new ErrorHandler(`Error: ${message}`, 500)); // Enviar error al siguiente middleware
            // }
        } catch (error) {
            console.log("creando preferencia: " ,error);            
            next(new ErrorHandler(error instanceof Error ? error.message : 'Error al crear la preferencia', 500));
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
            const response1: any = await this.paymentUseCase.createNewPayment({ uuid: uuid4 });

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
                        const membership_info: any = await this.membershipUseCase.getInfoMembership(idMembership);
                        if (!(membership_info instanceof ErrorHandler)) {
                            let start_date1 = moment().format('L');
                            let end_date1 = moment().add(30, 'days').calendar();
                            let services = membership_info?.service_quantity;
                            let mem_id = membership_info?.id
                            if (services !== undefined) {
                                await Promise.all(services.map(async (item: any) => {
                                    try {
                                        const ok: any = await this.membershipBenefitUseCAse.createNewMembershipBenefit(
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

            next(new ErrorHandler('Error al crear el pago en la base de datos', 500));
        }

    }

    public async createPaymentProductMP(req: Request, res: Response, next: NextFunction) {
        const { branch_id, infoPayment, productsOrder, location, typeDelivery, subtotal, shipping_cost, discount } = req.body;
        const user = req.user
        const origin = req.headers["x-origin"];          
        const access_token = config.MERCADOPAGO_TOKEN;
        const client = new MercadoPagoConfig({ accessToken: access_token, options: { timeout: 5000 } });
        const payment1 = new Payment(client);
        const uuid4 = generateUUID();
        const order_id = RandomCodeId('CIC')
        const currentDate = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        const expDate = moment(currentDate).add(48, 'hours').format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        const taxDateExpiration = moment(currentDate).add(1, 'month').format("YYYY-MM-DDTHH:mm:ss.SSSZ");
        // console.log("the access token is:" + access_token);            
        const productToSend =  parseProductsToMercadoPago(productsOrder);                             
        try {
            await this.stockStoreHouseUseCase.validateProductsStock(productsOrder);          
            const { formData, selectedPaymentMethod } = infoPayment;
            const metadata1 = formData?.metadata;
            const point = metadata1?.payment_point || null;
            const path_notification = `${process.env.URL_NOTIFICATION}api/payments/Mem-Payment-success`;                        
            const body1: any = {
                transaction_amount: formData.transaction_amount,
                payment_method_id: formData.payment_method_id,
                payer: {
                    email: formData.payer.email,
                    first_name: formData.payer.first_name,
                    last_name: formData.payer.last_name,
                },
                additional_info: {
                    items: productToSend,
                    payer: {
                        first_name: user.fullname,
                    },
                },
                token: formData.token,
                issuer_id: formData.issuer,
                installments: formData.installments,
                notification_url: path_notification,
                external_reference: order_id,
                statement_descriptor: formData.statement_descriptor,
            };


            if (selectedPaymentMethod !== "credit_card" || selectedPaymentMethod !== "debit_card") {
                body1['metadata'] = { payment_point: point };
                body1['date_of_expiration'] = expDate
            }
                        
             const payment = await payment1.create({
                    requestOptions: { idempotencyKey: uuid4 },
                    body: body1,
             });                                  
            
            const { additional_info, id, status, transaction_details, payment_method } = payment
            if(status === "rejected"){ return next(new ErrorHandler('El pago fue rechazado ;c', 400)) }            
            if (payment) {
                const createPayment: any = await this.paymentUseCase.createNewPayment({
                    uuid: uuid4,
                    MP_info: { additional_info, id, status, transaction_details, payment_method },
                    user_id: user._id,
                    payment_status: payment?.status,
                    system: "CICHMEX",
                    order_id: order_id
                });

                if (!(createPayment instanceof ErrorHandler)) {
                    const values1: any = {
                        payment: createPayment?._id,
                        uuid: createPayment?.uuid,
                        products: productsOrder,
                        discount: discount,
                        subTotal: subtotal,
                        total: infoPayment.formData.transaction_amount,
                        user_id: user._id,
                        shipping_cost: shipping_cost,
                        paymentType: infoPayment.paymentType,
                        payment_status: payment?.status,
                        download_ticket: payment?.transaction_details?.external_resource_url,
                        order_id: createPayment?.order_id,
                        origin: origin,
                        order_status: status === "approved" ? 2 : 0,
                        tax_expiration_date: taxDateExpiration
                    };

                    if (typeDelivery === 'homedelivery') {
                        values1['deliveryLocation'] = location;
                        values1["typeDelivery"] = "homedelivery";
                    }
                    if (typeDelivery === 'pickup') {
                        values1['branch'] = branch_id;
                        values1['point_pickup_status'] = false;
                        values1["typeDelivery"] = "pickup";
                    }
                    // if (payment?.status === 'approved') {
                    await this.updateProductStock(productsOrder, order_id);             
                    //}                    
                    try {
                        const order: any | null = await this.productOrderUseCase.createProductOrder(values1);
                        const responseOrder = { ...order, id: payment?.id };
                        await this.notificationUseCase.sendNotificationToUsers(["CICHMEX", "CARWASH"], ["SUPER-ADMIN"],  {                                                      
                            "from" : user?._id,                            
                            "message" : "Cichmex, se ha creado un nuevo pedido",
                            "type" : "order", 
                            "resource_id": order._id,                                                                                                                                                                                          
                        })
                        this.invoke(responseOrder, 200, res, 'Se pagó con éxito', next);
                    } catch (error) {
                        next(new ErrorHandler('Error: No se pudo crear su orden. Por favor, contacte con servicio al cliente', 500));
                    }
                }
            } else {
                next(new ErrorHandler('Error en la respuesta de pago', 500));
            }
        } catch (error) {
            console.log("el error xd es: " + error);
            next(new ErrorHandler('Error al crear el pago en la base de datos', 500));
        }
    }

    public async transferPayment(req: Request, res: Response, next: NextFunction) {
        const { branch_id, productsOrder, location, typeDelivery, shipping_cost, discount, subTotal, total, coupon } = req.body;
        const uuid4 = generateUUID();
        const order_id = RandomCodeId('CIC');
        const user = req.user;
        const origin = req.headers["x-origin"];                
        try {
            if(!typeDelivery) return next(new ErrorHandler(`tipo de entrega es requerido`, 404))           
            if(typeDelivery === "homedelivery" && !location) return next(new ErrorHandler(`id de direccion requerida`, 404))           
            if(typeDelivery === "pickup" && !branch_id) return next(new ErrorHandler(`id de sucursal requerida`, 404))           
            // Verificación de existencia de productos
            await this.stockStoreHouseUseCase.validateProductsStock(productsOrder);         
            // Creación de un nuevo pago en la base de datos
            const response1: any = await this.paymentUseCase.createNewPayment({
                uuid: uuid4,
                user_id: user._id,
                payment_status: 'pending',
                system: "CICHMEX",
                products: productsOrder,
                order_id: order_id,
            });

            if (!response1 || response1 instanceof ErrorHandler) {
                return next(new ErrorHandler('Error en la creación del pago', 500));
            }

            // Preparación de los valores de la orden
            const values1: any = {
                payment: response1._id,
                uuid: response1.uuid,
                products: productsOrder,
                discount,
                subTotal,
                total,
                user_id: user._id,
                shipping_cost,
                paymentType: 'transfer',
                payment_status: response1.payment_status,
                order_id: order_id,
                origin: origin,
            };
            if(coupon){
                values1.coupon = coupon
            }
            // Configuración de la entrega según el tipo
            if (typeDelivery === 'homedelivery') {
                values1.deliveryLocation = location;
                values1["typeDelivery"] = "homedelivery";
            } 
            if (typeDelivery === 'pickup') {
                values1.branch = branch_id;
                values1.point_pickup_status = false;
                values1["typeDelivery"] = "pickup";
            }

            try {
                // Actualización del stock y creación de salida
                await this.updateProductStock(productsOrder, order_id)         
                // Creación de la orden del producto
                const order: any| null = await this.productOrderUseCase.createProductOrder(values1);
                await this.notificationUseCase.sendNotificationToUsers(["CICHMEX", "CARWASH"], ["SUPER-ADMIN"],  {                                                      
                    "from" : user?._id,                            
                    "message" : "Se ha creado un nuevo pedido",
                    "type" : "order", 
                    "resource_id": order._id,                                                                                                                                                                                          
                })
                return this.invoke(order, 200, res, 'Se pagó con éxito', next);
            } catch (error) {
                console.error('Error al actualizar el stock o crear la orden:', error);
                return next(new ErrorHandler('Error: No se pudo crear su orden. Por favor, contacte con servicio al cliente', 500));
            }

        } catch (error) {
            console.error('Error al crear el pago en la base de datos:', error);
            if (error instanceof Error) {
                return next(new ErrorHandler(`${error.message}`, 500));
            } else {
                return next(new ErrorHandler('Error al crear ', 500));
            }
        }
    }
    

    public async webhookMP(req: Request, res: Response, next: NextFunction) {        
        try {            
            const info: any = await this.mpService.reciveWebHook(req);                                    
                   
            res.status(200).send('OK');
            this.invoke(info, 201, res, 'Pago validado', next);
        } catch (error) {
            next(new ErrorHandler('Error', 500));
        }
    }

    public async createTicket(req: Request, res: Response, next: NextFunction) {

        try {
            const info: any = await this.mpService.reciveWebHook(req);

            if (info !== undefined && info.status === 'approved') {

                const response: any = await this.paymentUseCase.createNewPayment({ MP_info: info });
                if (!(response instanceof ErrorHandler)) {
                    const id_client = response.MP_info?.additional_info.payer.first_name;
                    const idMembership = response.MP_info?.additional_info.items[0].id;
                    const membership_info: any = await this.membershipUseCase.getInfoMembership(idMembership);
                    if (!(membership_info instanceof ErrorHandler)) {
                        let start_date1 = moment().format('L');
                        let end_date1 = moment().add(30, 'days').calendar();
                        let services = membership_info?.service_quantity;
                        let mem_id = membership_info?.id
                        if (services !== undefined) {
                            await Promise.all(services.map(async (item: any) => {
                                try {
                                    const ok: any = await this.membershipBenefitUseCAse.createNewMembershipBenefit(
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

    public async addTicket(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id, reference, amount } = req.body;
        const date = new MomentService().newDate();

        try {
            const payment: any = await this.paymentUseCase.getDetailPayment(id);
            
            if (!payment) {
                return next(new ErrorHandler('No se encontró el pago', 400));
            }

            if (req.file) {
                const pathObject = `${this.path}/${id}/${date}`;
                const { success } = await this.s3Service.uploadToS3AndGetUrl(`${pathObject}`, req.file, "image/jpeg");

                if (!success) {
                    return next(new ErrorHandler('Hubo un error al subir la imagen', 400));
                }

                const newVoucher = {
                    url: pathObject,
                    reference: reference,
                    amount: amount,
                    status: 'pending',
                    createdAt: date,
                };
                payment.verification = payment.verification || { payment_vouchers: [] };
                payment.verification.payment_vouchers.push(newVoucher);

                const response = await this.paymentUseCase.updateOnePayment(id, { verification: payment.verification, payment_status: 'pending_to_verify' });

                if (response.verification?.payment_vouchers) {
                    await Promise.all(
                        response.verification.payment_vouchers.map(async (item: any) => {
                            const url = await this.s3Service.getUrlObject(item.url);
                            item.url = url;
                        })
                    );
                }
                try {
                    const productOrder: any = await this.productOrderUseCase.getOnePO({ order_id: payment.order_id })
                    await this.productOrderUseCase.updateProductOrder(productOrder._id, { payment_status: 'pending_to_verify' })
                }
                catch (error) {
                    return next(new ErrorHandler('NO se actualizó la orden de producto', 500))
                }

                return this.invoke(response, 201, res, 'Se subió con éxito', next);
            } else {
                return next(new ErrorHandler('No se subió imagen', 400));
            }
        } catch (error) {
            console.log(error);

            return next(new ErrorHandler('Hubo un error al actualizar el pago', 500));
        }
    }

    public async editVoucher(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id, createdAt, reference, amount } = req.body;

        try {
            const payment: any = await this.paymentUseCase.getDetailPayment(id);
            if (!payment) {
                return next(new ErrorHandler('No se encontró el pago', 400));
            }

            const voucherIndex = payment.verification?.payment_vouchers?.findIndex((v: any) => v.createdAt === createdAt);
            if (voucherIndex === undefined || voucherIndex < 0) {
                return next(new ErrorHandler('No se encontró el voucher', 400));
            }

            if (req.file) {
                const pathObject = `${this.path}/${id}/${createdAt}`;
                const { success } = await this.s3Service.uploadToS3AndGetUrl(`${pathObject}`, req.file, "image/jpeg");

                if (!success) {
                    return next(new ErrorHandler('Hubo un error al subir la imagen', 400));
                }

                payment.verification!.payment_vouchers![voucherIndex] = {
                    ...payment.verification!.payment_vouchers![voucherIndex],
                    url: pathObject,
                    reference,
                    amount,
                    // notes,
                    // verification_responsible: _id,
                    // verification_time: date,
                    createdAt: payment.verification!.payment_vouchers![voucherIndex].createdAt // Mantener la fecha de creación original
                };
                const response = await this.paymentUseCase.updateOnePayment(id, { verification: payment.verification });
                if (response.verification?.payment_vouchers) {
                    await Promise.all(
                        response.verification.payment_vouchers.map(async (item: any) => {
                            const url = await this.s3Service.getUrlObject(item.url);
                            item.url = url;
                        })
                    );
                }
                return this.invoke(response, 200, res, 'Voucher actualizado con éxito', next);
            } else {
                return next(new ErrorHandler('No se subió imagen', 400));
            }
        } catch (error) {
            return next(new ErrorHandler('Hubo un error al actualizar el voucher', 500));
        }
    }


    public async deleteVoucher(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id, createdAt } = req.body;

        try {
            const payment: any = await this.paymentUseCase.getDetailPayment(id);
            if (!payment) {
                return next(new ErrorHandler('No se encontró el pago', 400));
            }

            const voucherIndex = payment.verification?.payment_vouchers?.findIndex((v: any) => v.createdAt === createdAt);
            if (voucherIndex === undefined || voucherIndex < 0) {
                return next(new ErrorHandler('No se encontró el voucher', 400));
            }

            payment.verification!.payment_vouchers!.splice(voucherIndex, 1);

            const response = await this.paymentUseCase.updateOnePayment(id, { verification: payment.verification });
            if (response.verification?.payment_vouchers) {
                await Promise.all(
                    response.verification.payment_vouchers.map(async (item: any) => {
                        const url = await this.s3Service.getUrlObject(item.url);
                        item.url = url;
                    })
                );
            }
            return this.invoke(response, 200, res, 'Voucher eliminado con éxito', next);
        } catch (error) {
            return next(new ErrorHandler('Hubo un error al eliminar el voucher', 500));
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

    public async validateProofOfPayment(req: Request, res: Response, next: NextFunction) {
        const { id, createdAt } = req.body;
        const date = new MomentService().newDate();
        const userId = req.user?._id;
        try {
            const payment: any = await this.paymentUseCase.getDetailPayment(id)
            if (!payment) {
                return next(new ErrorHandler('No se encontro el pago', 500))
            }
            const voucherIndex = payment.verification?.payment_vouchers?.findIndex((v: any) => v.createdAt === createdAt);
            if (voucherIndex === undefined || voucherIndex < 0) {
                return next(new ErrorHandler('No se encontró el voucher', 400));
            }

            const voucher = payment.verification!.payment_vouchers![voucherIndex]

            const productOrder: any = await this.productOrderUseCase.getOnePO({ order_id: payment.order_id })

            payment.verification!.payment_vouchers![voucherIndex] = {
                ...payment.verification!.payment_vouchers![voucherIndex],
                verification_responsible: userId,
                verification_time: date,
                status: 'approved',
                createdAt: payment.verification!.payment_vouchers![voucherIndex].createdAt // Mantener la fecha de creación original
            };

            payment.verification.last_verification_time = date
            
            let vouchers: [] = payment.verification.payment_vouchers;

            const amountVauchers = vouchers
            .filter((voucher: any) => voucher.status === 'approved') // Filtrar solo los aprobados
            .reduce((accumulator: number, voucher: any) => accumulator + Number(voucher.amount), 0); // Sumar los amounts
          

            if ((amountVauchers >=  productOrder.total) && productOrder) {

                const updatePayment = await this.paymentUseCase.updateOnePayment(id, { verification: payment.verification, payment_status:'approved', });
                if (!updatePayment) {
                    return  next(new ErrorHandler('Error al acutualizar el pago',500))
                }

                const updateOnePayment = await this.productOrderUseCase.updateProductOrder(productOrder._id,{payment_status:'approved'})
                if (!updateOnePayment){
                    return  next(new ErrorHandler('Error al acutualizar la orden de productos',500))
                }
                const response: any = await this.productOrderUseCase.getOneProductOrder(productOrder._id)

                if (response.payment && response.payment.verification && response.payment.verification.payment_vouchers) {
                    const promises = response.payment.verification.payment_vouchers.map(async (item: any) => {
                      const url = await this.s3Service.getUrlObject(item.url);
                      item.url = url; // Actualizando el URL con el valor desde S3
                    });
                    await Promise.all(promises); // Espera a que todas las promesas se resuelvan
                  }

                this.invoke(response, 201, res, 'Ticket y venta aprobada', next);

            } else {
                const updatePayment = await this.paymentUseCase.updateOnePayment(id, { verification: payment.verification, });
                if (!updatePayment) {
                    return  next(new ErrorHandler('Error al acutualizar el pago',500))
                }
                const response : any = await this.productOrderUseCase.getOneProductOrder(productOrder._id)
                if (response.payment && response.payment.verification && response.payment.verification.payment_vouchers) {
                    const promises = response.payment.verification.payment_vouchers.map(async (item: any) => {
                      const url = await this.s3Service.getUrlObject(item.url);
                      item.url = url; // Actualizando el URL con el valor desde S3
                    });
                    await Promise.all(promises); // Espera a que todas las promesas se resuelvan
                  }

                this.invoke(response, 201, res, 'Ticket aprobado', next);
            }
        } catch (error) {
            console.error(error);
            next(new ErrorHandler('Hubo un error al autorizar', 500));
        }
    }

    public async rejectProofOfPayment(req: Request, res: Response, next: NextFunction) {
        const { id, createdAt, notes } = req.body;
        const date = new MomentService().newDate();
        const userId = req.user?._id;
        try {
            const payment: any = await this.paymentUseCase.getDetailPayment(id)
            if (!payment) {
                return next(new ErrorHandler('No se encontro el pago', 500))
            }
            const voucherIndex = payment.verification?.payment_vouchers?.findIndex((v: any) => v.createdAt === createdAt);
            if (voucherIndex === undefined || voucherIndex < 0) {
                return next(new ErrorHandler('No se encontró el voucher', 400));
            }

            const productOrder: any = await this.productOrderUseCase.getOnePO({ order_id: payment.order_id })

            payment.verification!.payment_vouchers![voucherIndex] = {
                ...payment.verification!.payment_vouchers![voucherIndex],
                verification_responsible: userId,
                verification_time: date,
                status: 'rejected',
                notes: notes,
                createdAt: payment.verification!.payment_vouchers![voucherIndex].createdAt // Mantener la fecha de creación original
            };
            payment.verification.last_verification_time = date

                const updatePayment = await this.paymentUseCase.updateOnePayment(id, { verification: payment.verification, });
                if (!updatePayment) {
                    return  next(new ErrorHandler('Error al acutualizar el pago',500))
                }
                const response : any = await this.productOrderUseCase.getOneProductOrder(productOrder._id)
                if (response.payment && response.payment.verification && response.payment.verification.payment_vouchers) {
                    const promises = response.payment.verification.payment_vouchers.map(async (item: any) => {
                      const url = await this.s3Service.getUrlObject(item.url);
                      item.url = url; // Actualizando el URL con el valor desde S3
                    });
                    await Promise.all(promises); // Espera a que todas las promesas se resuelvan
                  }

                this.invoke(response, 201, res, 'Ticket rechazado', next);
        
        } catch (error) {
            console.error(error);
            next(new ErrorHandler('Hubo un error al rechazar', 500));
        }
    }
   
    public async webhook(req: Request, res: Response, next: NextFunction){            
        try {
            // console.log("webhook, i was executed");
            const paymentId = req.body.data && req.body.data.id;
            if (!paymentId) return next(new ErrorHandler(`id de pago no encontrado`, 404))                       
            const access_token = config.MERCADOPAGO_TOKEN;
            const client = new MercadoPagoConfig({ accessToken: access_token, options: { timeout: 5000 } });
            const paymentClient = new Payment(client);
            const payment = await paymentClient.get({ id: paymentId });  
            if(payment.status === "rejected") return next(new ErrorHandler(`El pago no se aprobo`, 404))                                                                                                                              
            if (payment.metadata) {              
                const metadata = payment.metadata;  
                const orderId = payment.external_reference;                        
                const uuid4 = generateUUID();            
                const currentDate = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                const expDate = moment(currentDate).add(48, 'hours').format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                const taxDateExpiration = moment(currentDate).add(1, 'month').format("YYYY-MM-DDTHH:mm:ss.SSSZ");
                const cart: any = await this.shoppingCartUseCase.getShoppingCartByUser(metadata.user_id);
                const products = JSON.stringify(cart.products);
                // console.log(products);                                
                // // console.log(products, "productos");                            
                const orderPayload: any = {      
                    order_id: orderId,                          
                    products: JSON.parse(products),
                    discount: metadata.discount,
                    subTotal: metadata.subtotal,
                    total: metadata.total,
                    user_id: metadata.user,
                    shipping_cost: metadata.shipping,
                    paymentType: payment.payment_method,
                    payment_status: payment?.status,
                    download_ticket: payment?.transaction_details?.external_resource_url,                
                    origin: metadata.origin,
                    order_status: payment.status === "approved" ? 2 : 0,
                    tax_expiration_date: taxDateExpiration,
                    typeDelivery: metadata.delivery,                
                }; 
                if (metadata.type_delivery === "homedelivery") {
                    orderPayload.deliveryLocation = metadata?.address;                
                } 
                if (metadata.type_delivery === 'pickup') {
                    orderPayload.branch = metadata.branch;               
                }
                const { additional_info, id, status, transaction_details, payment_method } = payment
                const createPayment: any = await this.paymentUseCase.createNewPayment({
                    uuid: uuid4,
                    MP_info: { additional_info, id, status, transaction_details, payment_method },
                    user_id: metadata.user,
                    payment_status: payment?.status,
                    system: "CICHMEX",
                    order_id: orderId
                });
                const order: any | null = await this.productOrderUseCase.createProductOrder({...orderPayload, payment: createPayment._id});
                const responseOrder = { ...order, id: payment?.id };
                await this.updateProductStock(cart.products, orderId);
                await this.notificationUseCase.sendNotificationToUsers(["CICHMEX", "CARWASH"], ["SUPER-ADMIN"],  {                                                      
                    "from" : metadata.user_id,                            
                    "message" : "Cichmex, se ha creado un nuevo pedido",
                    "type" : "order", 
                    "resource_id": order._id,                                                                                                                                                                                          
                })            
                this.invoke(responseOrder, 200, res, 'Se pagó con éxito', next);                                      
            } 
          } catch (error) {
            console.error('Error en el webhook:', error);
            return next(new ErrorHandler(error instanceof Error ? error.message : 'Error al crear la orden', 500));
          }
    }
    
    private async updateProductStock(productsOrder: any[], order_id: string) {
        try{
            await Promise.all(productsOrder.map(async (product: any) => {
                    let available;
                    if (product?.variant) {
                        available = await this.stockStoreHouseUseCase.getVariantStock(product.variant._id);
                    } else {
                        available = await this.stockStoreHouseUseCase.getProductStockPayment(product.item._id);
                    }
                    if (available) {
                        const newQuantity = available.stock - parseInt(product.quantity);
                        const update = await this.stockSHoutputUseCase.createOutput({
                            order_id,
                            newQuantity,
                            quantity: product.quantity,
                            SHStock_id: available._id,
                            product_detail: product,
                            reason: 'Sale Cichmex'
                        });
                        await this.stockStoreHouseUseCase.updateStock(available._id, { stock: update?.newQuantity });
                    }
                })
            );
        }catch(error){
            console.log("hubo un error al actualizar el stock", error);            
        }
    }
}

