import { config } from '../../../../config';
import { MercadoPagoConfig, Preference } from 'mercadopago';

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
                            quantity: 1
                        },
                    ],
                    back_urls: {
                        "success": "https://localhost:3000/auth/PagoExitoso",
                        "failure": "https://localhost:3000/auth/inicio",
                        "pending": "https://localhost:3000/auth/inicio"
                    },
                    auto_return: "approved",
                    notification_url:'https://2e43-2806-2a0-101b-413f-f667-94f0-c972-d512.ngrok-free.app/api/payments/success'

                }
            });

            return { response, success: true, message: 'Pago realizado correctamente' };
        } catch (error) {
           console.log(error,'mpservice');
           
            return { success: false, message: `Error: ${error?.message}` };
        }
    }
}
