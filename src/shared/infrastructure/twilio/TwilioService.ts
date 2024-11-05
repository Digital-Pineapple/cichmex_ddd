import { Twilio } from 'twilio';
import { ErrorHandler } from '../../domain/ErrorHandler';

export class TwilioService {
    private twilio: Twilio;
    private accountSid   = process.env.TWILIO_ACCOUNT_SID;
    private authToken    = process.env.TWILIO_AUTH_TOKEN;
    private twilioNumber = process.env.TWILIO_PHONE_NUMBER;
    private whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    constructor() {
        this.twilio = new Twilio(this.accountSid, this.authToken);
    }

    async sendSMS(phone: string, body: string): Promise<any> {
        try {
            const message = await this.twilio.messages.create({
                body,
                from: this.twilioNumber,
                to: phone,
            });
            
            return message;
        } catch (error) {
            throw new ErrorHandler('Hubo un error al enviar el mensaje - intenta más tarde', 400);
        }
    }
    async sendWhatsappMessage(phone: string, body: string): Promise<any> {              
        try {
            const message = await this.twilio.messages.create({
                from:`whatsapp:${this.whatsappNumber}`,
                body,
                to:`whatsapp:${phone}`,
            });
            return message;
        } catch (error) {
            console.log("via whatsapp", error);            
            throw new ErrorHandler('Hubo un error al enviar el mensaje - intenta más tarde', 400);
        }
    }
}

