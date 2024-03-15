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
                        "success": "https://carwashymas.com/auth/inicio",
                        "failure": "http://localhost:3000/auth/inicio",
                        "pending": "http://www.tu-sitio/pending"
                    },
                    auto_return: "approved",

                }
            });

            return { response, success: true, message: 'Pago realizado correctamente' };
        } catch (error) {
           console.log(error,'mpservice');
           
            return { success: false, message: `Error: ${error?.message}` };
        }
    }
}
