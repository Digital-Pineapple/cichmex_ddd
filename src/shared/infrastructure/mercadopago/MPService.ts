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


    async createLinkMP(item: any, user_id:any) {   
        
        
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
                        "success": "https://localhost:3000/auth/PagoExitoso",
                        "failure": "https://localhost:3000/auth/inicio",
                        "pending": "https://localhost:3000/auth/inicio"
                    },
                
                    auto_return: "approved",
                    notification_url:'https://de31-2806-2a0-101b-413f-6327-6a6c-d794-7078.ngrok-free.app/api/payments/success',
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
}