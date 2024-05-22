import { response } from 'express';
import { config } from '../../../../config';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

export class MPService {
    private access_token = config.MERCADOPAGO_TOKEN;
    private preference: Preference;
    private payment : Payment;
    


    constructor() {
        const client = new MercadoPagoConfig({ accessToken: this.access_token });
        this.preference = new Preference(client);
        this.payment = new Payment(client)
        
    }


    async   createLinkMP(item: any, user_id:any) {   
        const path = `${process.env.PATH_MP}`
        const path_notification =`${process.env.URL_NOTIFICATION}`
        
        
        try {
            const response = await this.preference.create({
                body: {
                    items:[
                        {
                            id:item._id,
                            title:item?.name,
                            unit_price:item?.price_discount,
                            quantity: 1,
                        },
                    ],
                    payer:{
                        name:user_id,
                       
                        
                    },
                    back_urls: {
                        "success":  `${path}/PagoExitoso`,
                        "failure": `${path}/inicio`,
                        "pending": `${path}/inicio`
                    },
                
                    auto_return: "approved",
                    notification_url:`${path_notification}/api/payments/success`,
                }
            });

            return { response, success: true, message: 'Pago realizado correctamente' };
        } catch (error) {
           console.log(error);
           
            return { success: false, message: `Error: ${error}` };
        }
    }

    async reciveWebHook(data:any) {

        const payment = data.query
        const paymentID = data.query['data.id']
        let info = ''
        
        try {
            if (payment.type === 'payment') {
                const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentID}`,{
                    method:'GET',
                    headers:{
                        'Authorization':`Bearer ${this.access_token}`
                    }
                })
                if (response.ok) {
                    const data = await response.json()
                    info = data
                }

                return info
            }
        } catch (error) {
            console.log(error);
            
        }
    }

    async createPaymentMP(item: any, user:any, uuid:any, membership:any) {   
        
        const path_notification =`${process.env.URL_NOTIFICATION}/api/payments/Mem-Payment-success`
        
        try {
            const response = await this.payment.create({
                requestOptions:{idempotencyKey:`${uuid}`},
                body: {
                    transaction_amount:item.transaction_amount,
                    payment_method_id:item.payment_method_id,
                    payer:{
                        email:item.payer.email,
                        first_name:user.user_id  
                    },
                    additional_info:{
                        items:[
                            {
                                id:membership._id,
                                title:membership.name,
                                quantity:1,
                                unit_price:membership.price_standard,
                                description:membership.description,

                            }
                        ]
                    },
                    token:item.token,
                    issuer_id:item.issuer_id,
                    installments:item.installments,
                    notification_url:path_notification,

     
                }
            });

            return { response, success: true, message: 'Pago realizado correctamente' };
        } catch (error) {
           console.log(error);
           
            return { success: false, message: `Error: ${error}` };
        }
    }

    async createPaymentProductsMP(products: any, user:any, uuid:any, values:any) {   
        
        const path_notification =`${process.env.URL_NOTIFICATION}/api/payments/Mem-Payment-success`
        
        try {
            const response = await this.payment.create({
                requestOptions:{idempotencyKey:`${uuid}`},
                body: {
                    transaction_amount:values.transaction_amount,
                    payment_method_id:values.payment_method_id,
                    payer:{
                        email:values.payer.email,
                        first_name:user.user_id  
                    },
                    additional_info:{
                        items:products,
                        payer:user,
                    },
                    token:values.token,
                    issuer_id:values.issuer_id,
                    installments:values.installments,
                    notification_url:path_notification,

     
                }
            });

            return { response, success: true, message: 'Pago realizado correctamente' };
        } catch (error) {
           console.log(error);
           
            return { success: false, message: `Error: ${error}` };
        }
}
}