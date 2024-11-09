var qrcode = require('qrcode-terminal');
import { Client, LocalAuth } from "whatsapp-web.js";



export class WhatsappService {
  private client: Client;
  private isReady: boolean = false;
  constructor() {
    // Inicializa el cliente de WhatsApp con la configuración deseada
    this.client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        headless: true,
        args: ["--disable-setuid-sandbox", "--unhandled-rejections=strict"],
      },
    });

    // Configura los eventos dentro del constructor
    this.client.on("qr", (qr) => {
      console.log("QR RECEIVED", qr);
      qrcode.generate(qr, { small: true });
    });

    this.client.on("ready", () => {
      console.log("Client is ready!");
      this.isReady = true;
    });

    // Inicializa el cliente para comenzar la conexión
    this.client.initialize();
  }
  public async sendMessage(phoneNumber: string, message: string): Promise<void> {
    try{
      // console.log(this.isReady, "xd");
      
      if (!this.isReady) {
        throw new Error("WhatsApp client is not ready yet.");
      }
      const chatId = "+527291623408@c.us"; // Formato de ID para el número de WhatsApp
      await this.client.sendMessage(chatId, message);
      console.log(`Mensaje enviado a ${7291623408}`);

    }catch(error){
      console.log("error whatsapp:", error);      
      throw new Error("Hubo un error al enviar el mensaje");
      
    }
  }
}

export const whatsappService = new WhatsappService();

