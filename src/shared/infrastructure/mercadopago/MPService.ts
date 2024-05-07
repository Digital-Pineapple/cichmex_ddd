import { response } from 'express';
import { config } from '../../../../config';
import { MercadoPagoConfig, Preference, } from 'mercadopago';

export class MPService {
    private access_token = config.MERCADOPAGO_TOKEN;
    private preference: Preference;


    constructor() {
        const client = new MercadoPagoConfig({ accessToken: this.access_token });
        this.preference = new Preference(client);
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
                        name:user_id
                        
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
        console.log(payment);
        
        
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
}