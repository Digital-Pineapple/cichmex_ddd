import { config } from '../../../../config';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export class MPService {
    private access_token = config.MERCADOPAGO_TOKEN;
    private preference: Preference;

    constructor() {
        const client = new MercadoPagoConfig({ accessToken: this.access_token });
        this.preference = new Preference(client);
    }

    async payMercadoPago(items: any) {
        try {
            const response = await this.preference.create({
                body: {
                    items:[
                        // {
                        //     id:item.id,
                        //     quantity: items.quantity,
                        //     title:'',
                        //     unit_price:'',
                        //     category_id:'',
                        //     currency_id:'',
                        //     description:'',
                        //     picture_url:'',
                        // }
                    ],
                    back_urls: {
                        success: 'https://example.com/success',
                        failure: 'https://example.com/failure'
                    },
                    auto_return: 'approved'
                }
            });

            return { response, success: true, message: 'Pago realizado correctamente' };
        } catch (error) {
           
            return { success: false, message: `Error: ${error}` };
        }
    }
}
