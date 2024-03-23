import { response } from 'express';
import { config } from '../../../../config';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
const mercadopago = require("mercadopago");

export class MPService {
    private access_token = config.MERCADOPAGO_TOKEN;
    private preference: Preference;

    constructor() {
        const client = new MercadoPagoConfig({ accessToken: this.access_token });
        this.preference = new Preference(client);
    }


    async createLinkMP(item: any) {   
        
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
                        
                    },
                    back_urls: {
                        "success": "https://localhost:3000/auth/PagoExitoso",
                        "failure": "https://localhost:3000/auth/inicio",
                        "pending": "https://localhost:3000/auth/inicio"
                    },
                    auto_return: "approved",
                    notification_url:'https://api.carwashymas.com/api/payments/success',
                }
            });

            return { response, success: true, message: 'Pago realizado correctamente' };
        } catch (error) {
           console.log(error);
           
            return { success: false, message: `Error: ${error?.message}` };
        }
    }

    async reciveWebHook(data:any) {
        const payment = data.query
        try {
            if (payment.type === 'payment') {
                const data = await mercadopago.payment.findById(payment['data.id'])
                return data
            }
        } catch (error) {
            console.log(error);
            
        }
    }
}