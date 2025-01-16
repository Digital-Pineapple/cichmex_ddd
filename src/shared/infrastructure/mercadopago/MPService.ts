import { config } from '../../../../config';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import moment, { ISO_8601 } from 'moment'
import { getProperties } from '../../../helpers/products';

export class MPService {
    private access_token: string;
    private preference: Preference;
    private payment: Payment;


    constructor() {
        this.access_token = config.MERCADOPAGO_TOKEN;
        const client = new MercadoPagoConfig({ accessToken: this.access_token });
        this.preference = new Preference(client);
        this.payment = new Payment(client);
    }

    async createLinkMP(items: any) {
        const path = process.env.PATH_MP;
        const path_notification = process.env.URL_NOTIFICATION;
        const itemsMP = items.map((item: any) => {
            const variant = item?.variant ?? null;
            const product = item.item;
            const quantity = item.quantity;
            const isVariant = Boolean(variant);
            const variantPrice = variant?.porcentDiscount ? variant?.discountPrice : variant?.price;
            const productPrice = product?.porcentDiscount ? product?.discountPrice : product?.price; 
            const newItem = {
              id:  product._id,
              title: product.name + (isVariant ? getProperties(variant?.attributes) : ""),
              unit_price: isVariant ? variantPrice : productPrice,
              picture_url:  isVariant ? variant.images[0].url : product.images[0].url,
              quantity: quantity
            };
            return  newItem           
        });          

        try {
            const response = await this.preference.create({
                body: {
                    items: itemsMP,
                    // payer: { name: user_id },
                    back_urls: {
                        success: `${path}/PagoExitoso`,
                        failure: `${path}/inicio`,
                        pending: `${path}/inicio`,
                    },
                    auto_return: "approved",
                    notification_url: `${path_notification}/api/payments/success`,
                },
            });

            return { response, success: true, message: 'Pago realizado correctamente' };
        } catch (error) {
            console.error('Error creating link:', error);
            return { success: false, message: `Error: ${error}` };
        }
    }

    async reciveWebHook(data: any) {
        const payment = data.query;
        const paymentID = data.query['data.id'];
        let info = '';

        try {
            if (payment.type === 'payment') {
                const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentID}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.access_token}`,
                    },
                });
                if (response.ok) {
                    info = await response.json();
                }

                return info;
            }
        } catch (error) {
            console.error('Error receiving webhook:', error);
        }
    }

    async createPaymentMP(item: any, user: any, uuid: string, membership: any) {
        const path_notification = `${process.env.URL_NOTIFICATION}/api/payments/Mem-Payment-success`;

        try {
            const response = await this.payment.create({
                requestOptions: { idempotencyKey: uuid },
                body: {
                    transaction_amount: item.transaction_amount,
                    payment_method_id: item.payment_method_id,
                    payer: {
                        email: item.payer.email,
                        first_name: user.user_id,
                    },
                    additional_info: {
                        items: [
                            {
                                id: membership._id,
                                title: membership.name,
                                quantity: 1,
                                unit_price: membership.price_standard,
                                description: membership.description,
                            },
                        ],
                    },
                    token: item.token,
                    issuer_id: item.issuer_id,
                    installments: item.installments,
                    notification_url: path_notification,
                },
            });

            return { response, success: true, message: 'Pago realizado correctamente' };
        } catch (error) {
            console.error('Error creating payment:', error);
            return { success: false, message: `Error: ${error}` };
        }
    }

    async createPaymentProductsMP(products: any, user: any, uuid: any, values: any) {
        const path_notification = `${process.env.URL_NOTIFICATION}/api/payments/Mem-Payment-success`;

        try {
            const response = await this.payment.create({
                requestOptions: { idempotencyKey: uuid },
                body: {
                    transaction_amount: values.formData.transaction_amount,
                    payment_method_id: values.formData.payment_method_id,
                    payer: {
                        email: values.formData.payer.email,
                        first_name: user.user_id,
                    },
                    additional_info: {
                        items: products,
                        payer: {
                            first_name: user.user_id,
                        },
                    },
                    token: values.formData.token,
                    issuer_id: values.formData.issuer_id,
                    installments: values.formData.installments,
                    notification_url: path_notification,
                },
            });

            return { response, success: true, message: 'Pago realizado correctamente' };
        } catch (error) {
            console.error('Error creating payment for products:', error);
            return { success: false, message: `Error: ${error}` };
        }
    }

    async createPaymentProductsMP2(products: any, user: any, uuid: any, values: any) {
        const path_notification = `${process.env.URL_NOTIFICATION}/api/payments/Mem-Payment-success`;
        const { formData, selectedPaymentMethod } = values;

        const body: any = {
            transaction_amount: formData.transaction_amount,
            payment_method_id: formData.payment_method_id,
            payer: {
                email: formData.payer.email,
                first_name: formData.payer.first_name,
                last_name: formData.payer.last_name,
            },
            additional_info: {
                items: products,
                payer: {
                    first_name: user.user_id,
                },
            },
            notification_url: path_notification,
        };

        if (selectedPaymentMethod === "ticket") {
            body['metadata'] = { payment_point: formData.metadata.payment_point };
        } else {
            body['token'] = formData.token;
            body['issuer_id'] = formData.issuer_id;
            body['installments'] = formData.installments;
        }

        try {
            const response = await this.payment.create({
                requestOptions: { idempotencyKey: `${uuid}`, timeout: 5000 },
                body,
            });

            return { response, success: true };
        } catch (error) {
            console.error('Error creating payment for products (method 2):', error);
            return { success: false, message: `Error: ${error}` };
        }
    }
}
